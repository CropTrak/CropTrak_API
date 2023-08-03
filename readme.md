## Install
```
npm install @croptrak/api --save
```

## Create a client

Your clientId and secret key are provided by CropTrak Support.

```js
let client = await new Client('http://api.croptrak.com', <clientId>, <secret>).init();
```

## Submitting Form Data

Start by getting a list of forms

```js
client.listForms();
```

The listForms function outputs a list of forms available

```
f34b2db1-ccb5-4007-8f1a-0d9f62941363    /Forms/Observations/Grower Info
312471f6-bf7e-4d46-9938-0c5ff1617f61    /Forms/Observations/Ranch Info
3efc44da-6acc-4cae-ab1f-cc85b3558309    /Forms/Observations/Block Info
a83d15a5-c16c-4aaa-ae5b-a47707c59802    /Forms/Observations/Share Map, Block Info & Directions
f36cc649-8bb0-4e6b-af1a-be92353e691b    /Forms/Observations/Parcel
836e9fc6-0b07-4476-be1d-b3060a9b36d4    /Forms/Observations/Fruit Sampling
76f034de-d83c-4e1d-9423-1c599efd1f29    /Forms/Observations/Field Ticket
e87019c5-407d-4d89-989d-b8b9047859a0    /Forms/Observations/Harvest
442aee50-8916-4048-bf61-950db031f00c    /Forms/Observations/Create Block
73db2d91-b2a3-4395-9402-aea568075287    /Forms/Observations/Create Grower
57186cff-9c7b-4444-8b46-169f3a6ab153    /Forms/Observations/Create Ranch

```

To start a new form for submission you will use the startForm function.

```js
let form = await client.startForm('/Forms/Observations/Grower Info');
```

The startForm command will also output to the console. 

```
// To submit this form:

let response = await form.save(
    assetGUID,
    {
  'Applies To': {
    'Grower ID (Famous)': null
  },
  'Grower Info': {
    'Company Owner (Contact)': null,
    'Contact Email': null,
    'Company Fax': null,
    'Company Phone': null
  },
  Address: {
    'Street Address 1': null,
    'Street Address 2': null,
    City: null,
    State: null,
    'Postal Code': null,
    County: null
  },
  Reference: {
    'Location Description': null,
    SPV: null,
    Fund: null,
    'Grower Notes': null
  },
  'Associated Contracts (1)': {
    'Contract ID': null,
    'Contract Documents': null
  }
}
)
```

The above code is a template for submitting a valid form. Replace the assetGuid variable and null values with your own variables.

Use the test() to perform a validation test or save() to submit your data.

Keep in mind unit types are defined by the database unit defaults.

## Get Assets

Assets are pulled recursively from root to the lowest hierarchy Asset. 

This can take some time to pull the assets.

```js

let assets = client.listAssets();

```