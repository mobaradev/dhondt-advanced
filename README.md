# dhondt-advanced
An advanced version of DHondt calculator for JavaScript. Allows to not only calculate mandates from one district but also total mandates for the array of districts. Each committee may have different results in different districts and this values can be automatically calculated basing on deviations that you can define.

## Simple use

### Calculate district seats
If you want to just calculate seats from one district, using simple parameters, you can call the static function calculateDistrictSeats
```js
calculateDistrictSeats(results, committees, numberOfSeats)
```

Example:
```js
DHondt.calculateDistrictSeats([50, 30, 20], ["A", "B", "C"], 5)
```

```js
[
    { value: 50, committee: 'A' },
    { value: 30, committee: 'B' },
    { value: 25, committee: 'A' },
    { value: 20, committee: 'C' },
    { value: 16.666666666666668, committee: 'A' }
]
```

## Advanced use
### How to use
To take advantage of the advanced features, you need to create an instance of **DHondt** class:
```js
const dHondt = new DHondt();
```

Then, declare districts using addDistrict:
```js
dHondt.addDistrict({name: "1", numberOfSeats: 20});
dHondt.addDistrict({name: "2", numberOfSeats: 16});
dHondt.addDistrict({name: "3", numberOfSeats: 2});
```

and declare committees:

| Name                     | Is required? | Type          | Description                                                                                                                             |
|--------------------------|--------------|---------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| name                     | true         | string        | Name of the committee                                                                                                                   |
| details                  | false        | any           | Details of the committee, you can define any type / structure you prefer, this will be given back in output                             |
| result                   | false*       | number        | Overall (average) result of the committee considering all districts                                                                     |
| results                  | false*       | Array<number> | Array of results in each district respectivaly. The length must match the number of districts                                           |
| districtResultDeviations | false        | Array<number> | Array of deviations (in %) from overall result of the committee. If defined, then result must be defined and results cannot be defined. |

* - result or results must be defined

Example 1:
```js
dHondt.addCommittee({name: "A", details: {color: "blue"}, result: [40, 60, 50]});
dHondt.addCommittee({name: "B", details: {color: "yellow"}, result: 30});
dHondt.addCommittee({name: "C", details: {color: "orange"}, result: 20});
```

### Calculate total seats
Calculate the mandates for all defined committees from all defined districts
The function takes one optional parameter: outputType

outputType is a number: (0, 1, 2, 3, 4) but you can also use string format ("raw", "detailed committees"
, "simplified committees", "detailed districts", "simplified districts") accordingly.

Example:
```js
dHondt.calculateTotalSeats(1);
```

```js
{
    committee: Committee { name: 'A', averageResult: 50, results: undefined },
    seats: 19,
        seatsByDistricts: [
        { district: [District], seats: 10 },
        { district: [District], seats: 8 },
        { district: [District], seats: 1 }
    ]
},
{
    committee: Committee { name: 'B', averageResult: 30, results: undefined },
    seats: 12,
        seatsByDistricts: [
        { district: [District], seats: 6 },
        { district: [District], seats: 5 },
        { district: [District], seats: 1 }
    ]
},
{
    committee: Committee { name: 'C', averageResult: 20, results: undefined },
    seats: 7,
        seatsByDistricts: [
        { district: [District], seats: 4 },
        { district: [District], seats: 3 },
        { district: [District], seats: 0 }
    ]
}
```

#### Output types
There are 5 types of an output for **calculateTotalSeats** function.

You can specify which one you want using the only one parameter:
```js
dHondt.calculateTotalSeats(outputType);
```

The default value is 1: Detailed committees

#### 0: RAW seats:
Array of seats (mandates).
Each object contains three keys:

| Name      | Type      | Description                                                  |
|-----------|-----------|--------------------------------------------------------------|
| district  | District  |                                                              |
| committee | Committee |                                                              |
| value     | number    | Number that represents the value from the DHondt's algorithm |

```js
[
  {
    value: 50,
    committee: Committee { name: 'A', averageResult: 50, results: undefined },
    district: District { id: 0, numberOfSeats: 10, name: '1' }
  },
  {
    value: 30,
    committee: Committee { name: 'B', averageResult: 30, results: undefined },
    district: District { id: 0, numberOfSeats: 10, name: '1' }
  },
  ...
]
```

#### 1: Detailed committees (default)
This is the default output that shows the most details for each committee in convenient way.
Seats property describes the number of seats (mandates) that the committee gets from all districts
and seatsByDistrict array shows all the districts with the number of seats that the committee gets.

```js
[
  {
    committee: Committee { name: 'A', averageResult: 50, results: undefined },
    seats: 7,
    seatsByDistricts: [
        { district: [District], seats: 2},
        { district: [District], seats: 0},
        { district: [District], seats: 1}
    ]
  },

```


#### 2: Simplified committees
Simplified version returns only committee name and its total number of seats without more details.

```js
[
  { committee: 'A', seats: 7 },
  { committee: 'B', seats: 6 },
  { committee: 'C', seats: 3 }
]
```

3: Detailed districts

The seats shown from the district perspective. It returns an array of districts with details which seats were assigned to which committee.

```js
[
    {
        district: District { id: 0, numberOfSeats: 10, name: '1' },
        seats: [
            { committee: [Committee], value: 50 },
            { committee: [Committee], value: 30 },
            { committee: [Committee], value: 25 },
            { committee: [Committee], value: 20 }
        ],
        committees: [
            { committee: [Committee], seats: 5 },
            { committee: [Committee], seats: 3 },
            { committee: [Committee], seats: 2 }
        ]
    }
]

```

4: Simplified districts
```js
[
    {
        district: "District 1",
        committees: [
            { committee: "A", seats: 5 },
            { committee: "B", seats: 3 },
            { committee: "C", seats: 2 }
        ]
    },
    ...
]

```

## Version
0.90 (Mar 20, 2023)

## Author

Michal Obara (@mobaradev)  
[mobaradev@yahoo.com](mailto:mobaradev@yahoo.com)  
http://www.mobaradev.com

## License

MIT License

Copyright (c) 2023 Michal Obara (mobaradev)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
