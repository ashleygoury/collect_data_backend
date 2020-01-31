import {Component, OnInit} from '@angular/core';
import {EventData} from "tns-core-modules/data/observable";
import {ListPicker} from "tns-core-modules/ui/list-picker";
import {Page} from "tns-core-modules/ui/page";
import * as geolocation from "nativescript-geolocation";
import {Accuracy} from "tns-core-modules/ui/enums";
import {HttpClient} from "@angular/common/http";
import * as Toast from 'nativescript-toast';

@Component({
    selector: 'ns-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    times: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    newTimeSlot = false;

    points = {
        "start": {
            "startLat": null,
            "startLng": null
        },
        "end": {
            "endLat": null,
            "endLng": null
        },
        "allyear": null,
        "days": []
    };

    dayCheck = {
        "day": null,
        "timeOne": {
            "timeStartOne": null,
            "timeFinishOne": null,
        },
        "timeTwo": {
            "timeStartTwo": null,
            "timeFinishTwo": null,
        }
    };

    constructor(private page: Page, private http: HttpClient) {
        this.page.actionBarHidden = true;
    }

    ngOnInit() {
    }

    getStartLocation() {
        let that = this;
        geolocation.getCurrentLocation({
            desiredAccuracy: Accuracy.high,
            maximumAge: 5000,
            timeout: 10000
        }).then(function (loc) {
            if (loc) {
                that.points.start.startLat = loc.latitude;
                that.points.start.startLng = loc.longitude;
                Toast.makeText("Start, next go to the end location").show();
            }
        });
    }

    getEndLocation() {
        let that = this;
        geolocation.getCurrentLocation({
            desiredAccuracy: Accuracy.high,
            maximumAge: 5000,
            timeout: 10000
        }).then(function (loc) {
            if (loc) {
                that.points.end.endLat = loc.latitude;
                that.points.end.endLng = loc.longitude;
                Toast.makeText("Check if it is applicable for the entire year. Then select the time.").show();
            }
        });
    }

    reset() {
        this.points.start.startLat = null;
        this.points.start.startLng = null;
        this.points.end.endLat = null;
        this.points.end.endLng = null;
        this.points.allyear = null;
        this.dayCheck.timeOne.timeStartOne = null;
        this.dayCheck.timeOne.timeFinishOne = null;
        this.dayCheck.timeTwo.timeStartTwo = null;
        this.dayCheck.timeTwo.timeFinishTwo = null;

    }

    save() {
        console.log(this.points);
        if (this.points.start.startLng !== null && this.points.end.endLng !== null && this.dayCheck.timeOne.timeStartOne !== 0) {
            this.http.post('https://data-polyline.firebaseio.com/.json', this.points)
                .subscribe(res => {
                        console.log(res);
                        Toast.makeText("Save").show();
                    }
                );
        } else {
            alert("Not successfull");
        }
    }

    addNewTime() {
        this.newTimeSlot = true;
    }

    onStartHourOne(args: EventData) {
        const picker = <ListPicker>args.object;
        this.dayCheck.timeOne.timeStartOne = this.times[picker.selectedIndex];
        Toast.makeText("Selected start time").show();
    }

    onEndHourOne(args: EventData) {
        const picker = <ListPicker>args.object;
        this.dayCheck.timeOne.timeFinishOne = this.times[picker.selectedIndex];
        Toast.makeText("Selected end time").show();
    }

    onStartHourTwo(args: EventData) {
        const picker = <ListPicker>args.object;
        this.dayCheck.timeTwo.timeStartTwo = this.times[picker.selectedIndex];
        Toast.makeText("Selected second start time").show();
    }

    onEndHourTwo(args: EventData) {
        const picker = <ListPicker>args.object;
        this.dayCheck.timeTwo.timeFinishTwo = this.times[picker.selectedIndex];
        Toast.makeText("Selected second last time").show();
    }

    addDay(day: number) {
        this.dayCheck.day = day;
        this.points.days.push(this.dayCheck);
        Toast.makeText("Checked").show();
    }

    fullyear() {
        this.points.allyear = true;
        Toast.makeText("Select the time.").show();
    }
}
