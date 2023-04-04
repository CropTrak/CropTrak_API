

Create a client

```js
    let client = await new Client('http://api.croptrak.com', <clientId>, <secret>).init();
```



```js
Use the save() or test() to test and submit your data

Usage example (Keep in mind units are defined by the database unit defaults)

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