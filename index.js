import http from './http.js';
import { inspect } from 'util';

class Asset {
    constructor(asset, client, options) {
        if (!options) {
            options = {
                debug: false
            }
        }
        this.asset = asset;
        this.host = host;
        this.clientId = clientId;
        this.secret = secret;
        this.debug = options.debug;
        this.assetGUID = asset.guid;
    }
}
class Form {
    constructor(form, client, options) {
        if (!options) {
            options = {
                debug: false
            }
        }
        this.form = form;
        this.host = client.host;
        this.clientId = client.clientId;
        this.secret = client.secret;
        this.debug = options.debug;
        this.template = {};
        this.sections = [];
        this.submission_sections = {};
        this.form_group;
    }
    async init() {
        this.template = await http({
            path: `/form/${this.form.guid}/BeginDataEntry`,
            method: 'GET',
            base_url: this.host,
            clientId: this.clientId,
            secret: this.secret,
            debug: this.debug
        })
        this.form_group = this.template.guid;
        for (let s in this.template.sections) {
            let section = this.template.sections[s];    
            let newSection = {};
            for (let i in section.items) {
                let item = section.items[i];
                //These types cannot be sent and are evaluated based on applicable assets submission.
                if (item.type != 'AdvancedReadonlyQuery') {
                    newSection[item.caption] = null;
                }
            }
            this.sections[section.name] = section;
            if (newSection != {}) {
                this.submission_sections[section.name] = newSection;
            }
        }
        console.log(`
To submit this form:

let response = await form.save(
    assetGUID,
    ${inspect(this.submission_sections, { compact: false, depth: 5, breakLength: 80, colors: true })}
)
        `);
        return this;
    }
    _preflight(assetGUID, formData) {
        let newObject = {
            name: this.template.name,
            applicable_assets: assetGUID,
            form_group: this.form_group,
            sections: []
        };
        for (let s in this.template.sections) {
            let section = this.template.sections[s];
            // put all sections into seperate array unless they are an array
            let array_placeholder = [];
            if (!Array.isArray(section)) {
                array_placeholder = [section];
            }
            for (let a in array_placeholder) {
                let newSection = {
                    name: section.name,
                    form_group: section.form_group,
                    items: []
                }
                if (a > 0) {
                    delete newSection.form_group;
                    newSection.repeatable = true;
                }
                for (let i in section.items) {
                    let item = section.items[i];
                    let newItem = {};
                    if (formData[section.name] && formData[section.name][item.caption]) {
                        newItem.caption = item.caption;
                        newItem.guid = item.guid;
                        newItem.value = formData[section.name][item.caption];
                    }
                    if (newItem.value) {
                        newSection.items.push(newItem);
                    }
                }
                newObject.sections.push(newSection);
            }
        }
        console.log(inspect(newObject, { compact: false, depth: 5, breakLength: 80, colors: true }))
        return newObject;
    }
    async save(assetGUID, formData) {
        formData = this._preflight(assetGUID, formData);
        let result = await http({
            path: `/form/Save`,
            method: 'POST',
            base_url: this.host,
            clientId: this.clientId,
            secret: this.secret,
            debug: this.debug,
            body: JSON.stringify(formData)
        })
        return result;
    }
    async test(assetGUID, formData) {
        formData = this._preflight(assetGUID, formData);
        let result = await http({
            path: `/form/GetData`,
            method: 'POST',
            base_url: this.host,
            clientId: this.clientId,
            secret: this.secret,
            debug: this.debug,
            body: JSON.stringify(formData)
        })
        return result;
    }
}
class Client {
    constructor(host, clientId, secret, options) {
        if (!options) {
            options = {
                debug: false
            }
        }
        this.host = host;
        this.clientId = clientId;
        this.secret = secret;
        this.debug = options.debug;
        this.forms = {};
        this.assets = {};
    }
    async _getForms() {
        let forms = [];
        let root = await http({
            path: `/form/GetFormNodes`,
            method: 'GET',
            base_url: this.host,
            clientId: this.clientId,
            secret: this.secret,
            debug: this.debug
        })
        for (let r in root) {
            let folder = root[r];
            if (folder.form_type == 'Form') {
                forms.push(folder);
            }
            if (folder.form_type == 'Folder') {
                let subfolderForms = await this._getFormChildren(folder.guid);
                for (let s in subfolderForms) {
                    let subfolderForm = subfolderForms[s];
                    if (subfolderForm.form_type == 'Form') {
                        forms.push(subfolderForm);
                    }
                }
            }
        }
        for (let f in forms) {
            let form = forms[f];
            form.name = form.name.trim();
            form.path = form.path.trim();
            this.forms[form.path] = form;
        }
        return this;
    }
    async _getFormChildren(hierarchySpecGuid) {
        let contents = await http({
            path: `/form/${hierarchySpecGuid}/GetChildren`,
            method: 'GET',
            base_url: this.host,
            clientId: this.clientId,
            secret: this.secret,
            debug: this.debug
        })
        if (!Array.isArray(contents)) {
            return;
        }
        for (let c in contents) { 
            let content = contents[c]; 
            if (content.form_type == 'Form') {
                this.forms[content.path.trim()] = content;
            } else if (content.form_type == 'Folder') {
                await this._getFormChildren(content.guid);
            } 
        } 
        return this.forms;
    }
    async _getAssets(){
        let rootAssets = await http({
            path: `/asset`,
            method: 'GET',
            base_url: this.host,
            clientId: this.clientId,
            secret: this.secret,
            debug: this.debug
        })
        for (let r in rootAssets) {
            let root = rootAssets[r];
            await this._getAssetChildren(root.guid);
        }
    }
    async _getAssetChildren(assetGuid) {
        let assetChildren = await http({
            path: `/asset/${assetGuid}/GetChildren`,
            method: 'GET',
            base_url: this.host,
            clientId: this.clientId,
            secret: this.secret,
            debug: this.debug
        })

        if (typeof assetChildren == 'object') {
            for (let a in assetChildren) {
                let asset = assetChildren[a];
                this.assets[asset.guid] = asset;
                await this._getAssetChildren(asset.guid);
            }
        }
    }
    async listForms() {
        if (Object.keys(this.forms).length == 0) {
            console.log('Warning: No forms loaded. Refreshing...')
            await this._getForms();
        }
        console.log(`guid\t\t\t\t\tForm Path`);
        for (let f in this.forms) {
            let form = this.forms[f];
            console.log(`${form.guid}\t${form.path}`)
        }
        return this.forms;
    }
    async listAssets(list) {
        if (Object.keys(this.assets).length == 0) {
            console.log('Warning: No assets loaded. Refreshing...')
            await this._getAssets();
        }
        if (list && list.length > 0) {
            let assets = [];
            for (let l in list) {
                let guid = list[l];
                assets.push(this.assets[guid]);
            }
            return assets;
        }
        console.log(`guid\t\t\t\t\tAsset Name`);
        for (let a in this.assets) {
            let asset = this.assets[a];
            console.log(`${asset.guid}\t${asset.name}`)
        }
        return this.assets;
    }
    async startForm(path, options) {
        if (this.forms == {}) {
            console.log('Warning: No forms loaded. Refreshing...')
            await _getForms();
        }
        let form = this.forms[path.trim()];
        return await new Form(form, this, options).init();
    }
};

export default Client;