import {CommitteeData} from "../DHondt";

class Committee {
    name: string;
    details: any;
    averageResult: number;
    results: Array<number> | undefined;

    constructor(data: CommitteeData) {
        if (!data.name) {
            console.error(`[DHondt] required parameter 'name' not set. Committee not created.`);
            return;
        }

        if (!data.results && !data.result) {
            console.error(`[DHondt] 'results' or 'result' not set to the committee '${data.name}'. Committee not created.`);
            return;
        }

        if (data.results && data.districtResultDeviations) {
            console.warn(`[DHondt] 'results' and 'districtResultDeviations' set at the same time to the committee '${data.name}'. You should use only one of them => using 'results', ignoring 'districtResultDeviations'.`);
        }

        // set committee name
        this.name = data.name;

        // handle results
        if (data.results) {
            // take results from 'results' parameter
            this.results = data.results;
        } else if (data.districtResultDeviations) {
            // create results array using result (one average value) and deviations array
            this.results = [];

            for (let i = 0; i < data.districtResultDeviations.length; i++) {
                this.results.push(data.result + data.result * data.districtResultDeviations[i] / 100);
            }
        } else {
            // set only averageResult
            this.averageResult = data.result;
            this.results = undefined;
        }

        // set committee details
        if (data.details) this.details = data.details;
    }
}

export default Committee;
