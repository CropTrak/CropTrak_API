

Create a client

```js
let client = await new Client('http://api.croptrak.com', <clientId>, <secret>).init();
```

Use the save() or test() to test and submit your data

```js
client.listForms();
```

```
Outputs

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

Usage example (Keep in mind units are defined by the database unit defaults)

```js

form.save(
    {
        'Field Info':{
            name: 'Field Info',
            form_group: 'b69dea59-5133-4bfd-9415-88577f41ac32',
            'Acres': 107,
            'Irrigation Method': 'Drip',
            'Soil Texture': null
        },
        'Irrigation Method Details':{
            name: 'Irrigation Method Details',
            form_group: 'b69dea59-5133-4bfd-9415-88577f41ac32',
            'Irrigation Power Source': 'Grid',
            'Water Source': 'Local',
            'Pumping Depth': 5
        },
        // For repeating sections pass the sections inside an array
        [
            {
                'Irrigation Applications':{
                    name: 'Irrigation Applications',
                    form_group: 'b69dea59-5133-4bfd-9415-88577f41ac32',
                    'Amount Watered': 17,
                    'Date of Watering': '04/17/2018'
                }
            },
            {
                'Irrigation Applications':{
                    name: 'Irrigation Applications',
                    form_group: 'b69dea59-5133-4bfd-9415-88577f41ac32',
                    'Amount Watered': 17,
                    'Date of Watering': '04/17/2018'
                }
            }
        ]
    }
)
```