import District from "./District/District";
import Committee from "./Committee/Committee";

/*
    DHondt (dhondt-advanced) version 0.90
    by Michal Obara (mobaradev) mobaradev@yahoo.com http://mobaradev.com
    MIT License
*/

export type OutputTypes = 'raw' | 'detailed committees' | 'simplified committees' | 'detailed districts' | 'simplified districts' | 0 | 1 | 2 | 3 | 4;

export interface DistrictData {
    numberOfSeats: number,
    name?: string
}

export interface CommitteeData {
    name: string,
    details?: any,
    result?: number,
    results?: Array<number>,
    districtResultDeviations?: Array<number>
}

class DHondt {
    districts: Array<District>;
    committees: Array<Committee>;

    constructor() {
        this.districts = [];
        this.committees = [];
    }

    addDistrict(districtData: DistrictData) {
        const districtId = this.districts.length;
        if (!districtData.name) districtData.name = `District ${districtId + 1}`;

        this.districts.push(new District(districtId, districtData.numberOfSeats, districtData.name));
    }

    addCommittee(committeeData: CommitteeData) {
        const committee = new Committee(committeeData);
        this.committees.push(committee);
    }

    reset() {
        this.districts = [];
        this.committees = [];
    }

    calculateTotalSeats(outputType: OutputTypes = 1) {
        let totalSeats = [];
        let committeesByDistrict = [];
        for (let i = 0; i < this.districts.length; i++) {
            let committeesResults: Array<number> = [];
            let committeesNames: Array<string> = [];
            for (let j = 0; j < this.committees.length; j++) {
                if (this.committees[j].results) {
                    committeesResults.push(this.committees[j].results[i]);
                } else {
                    committeesResults.push(this.committees[j].averageResult);
                }
                committeesNames.push(this.committees[j].name);
            }

            let s = DHondt.calculateDistrictSeats(committeesResults, this.committees, this.districts[i]);

            committeesByDistrict.push([]);
            for (let j = 0; j < s.length; j++) {
                committeesByDistrict[i].push({committee: s[j].committee, value: s[j].value});
            }

            totalSeats.push(...s)
        }

        return DHondt.parse(totalSeats, outputType);
    }

    static calculateDistrictSeats(results: Array<number>, committees: Array<Committee> | Array<string>, district: District | number) {
        let seats = [];
        const numberOfSeats = (typeof district === "number" ? district : district.numberOfSeats);

        for (let i = 1; i < (numberOfSeats + 1); i++) {
            for (let j = 0; j < results.length; j++) {
                const result = results[j];

                if (typeof district === "number") {
                    seats.push({
                        value: result / i,
                        committee: committees[j]
                    });
                } else {
                    seats.push({
                        value: result / i,
                        committee: committees[j],
                        district: district
                    });
                }
            }
        }

        seats.sort((a, b) => a.value < b.value ? 1 : -1);
        seats = seats.splice(0, numberOfSeats);

        return seats;
    }

    static parse(rawSeats: Array<any>, outputType: OutputTypes) {
        if (outputType === "raw" || outputType === 0) return rawSeats;

        const committees = [];
        const districts = [];

        // extract committees and districts from the input to the 'committees' and 'districts' arrays
        for (let i = 0; i < rawSeats.length; i++) {
            if (committees.indexOf(rawSeats[i].committee) === -1) committees.push(rawSeats[i].committee);
            if (districts.indexOf(rawSeats[i].district) === -1) districts.push(rawSeats[i].district);
        }

        if (outputType === "detailed committees" || outputType === 1) {
            const result = [];

            for (let i = 0; i < committees.length; i++) {
                result.push({
                    committee: committees[i],
                    seats: 0,
                    seatsByDistricts: []
                });

                // populate districts
                for (let j = 0; j < districts.length; j++) {
                    result[i].seatsByDistricts.push({
                        district: districts[j],
                        seats: 0
                    })
                }
            }

            for (let i = 0; i < rawSeats.length; i++) {
                for (let j = 0; j < result.length; j++) {
                    if (result[j].committee === rawSeats[i].committee) {
                        result[j].seats++;

                        for (let k = 0; k < districts.length; k++) {
                            if (result[j].seatsByDistricts[k].district === rawSeats[i].district) {
                                result[j].seatsByDistricts[k].seats++;
                            }
                        }
                    }
                }
            }

            return result;
        } else if (outputType === "simplified committees" || outputType === 2) {
            const detailedResult = DHondt.parse(rawSeats, 1);
            const result = [];

            for (let i = 0; i < detailedResult.length; i++) {
                result.push({
                    committee: detailedResult[i].committee.name,
                    seats: detailedResult[i].seats
                })
            }

            return result;
        } else if (outputType === "detailed districts" || outputType === 3) {
            const result = [];

            for (let i = 0; i < districts.length; i++) {
                result.push({
                    district: districts[i],
                    seats: [],
                    committees: []
                });

                // populate committees
                for (let j = 0; j < committees.length; j++) {
                    result[i].committees.push({
                        committee: committees[j],
                        seats: 0
                    })
                }
            }

            for (let i = 0; i < rawSeats.length; i++) {
                for (let j = 0; j < result.length; j++) {
                    if (result[j].district === rawSeats[i].district) {
                        result[j].seats.push({
                            committee: rawSeats[i].committee,
                            value: rawSeats[i].value
                        })

                        for (let k = 0; k < committees.length; k++) {
                            if (result[j].committees[k].committee === rawSeats[i].committee) {
                                result[j].committees[k].seats++;
                            }
                        }
                    }
                }
            }

            return result;
        } else if (outputType === "simplified districts" || outputType === 4) {
            const detailedDistricts = DHondt.parse(rawSeats, 3);
            const result = [];

            for (let i = 0; i < detailedDistricts.length; i++) {
                result.push({
                    district: detailedDistricts[i].district.name,
                    committees: detailedDistricts[i].committees
                });

                for (let j = 0; j < result[i].committees.length; j++) {
                    result[i].committees[j].committee = result[i].committees[j].committee.name;
                }
            }

            return result;
        }
    }
}

export default DHondt;
