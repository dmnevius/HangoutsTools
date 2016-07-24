System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Data;
    return {
        setters:[],
        execute: function() {
            Data = (function () {
                function Data(data) {
                    this.data = data;
                    this.backgroundColors = [
                        "#f44336",
                        "#e91e63",
                        "#9c27b0",
                        "#673ab7",
                        "#3f51b5",
                        "#2196f3",
                        "#03a9f4",
                        "#00bcd4",
                        "#009688",
                        "#4caf50",
                        "#8bc34a",
                        "#cddc39",
                        "#ffeb3b",
                        "#ffc107",
                        "#ff9800",
                        "#ff5722",
                        "#795548",
                        "#9e9e9e",
                        "#607d8b"
                    ];
                    this.hoverColors = [
                        "#d32f2f",
                        "#c2185b",
                        "#7b1fa2",
                        "#512da8",
                        "#303f9f",
                        "#1976d2",
                        "#0288d1",
                        "#0097a7",
                        "#00796b",
                        "#388e3c",
                        "#689f38",
                        "#afb42b",
                        "#fbc02d",
                        "#ffa000",
                        "#f57c00",
                        "#e64a19",
                        "#5d4037",
                        "#616161",
                        "#455a64"
                    ];
                    this.months = [
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Object",
                        "Nov",
                        "Dec"
                    ];
                }
                Data.prototype.formatPieChart = function () {
                    var output = {
                        "labels": [],
                        "datasets": [{
                                data: [],
                                backgroundColor: [],
                                hoverBackgroundColor: []
                            }]
                    };
                    var color = 0;
                    for (var _i = 0, _a = this.data; _i < _a.length; _i++) {
                        var participant = _a[_i];
                        output.labels.push(participant.name);
                        output.datasets[0].data.push(participant.posts);
                        output.datasets[0].backgroundColor.push(this.backgroundColors[color]);
                        output.datasets[0].hoverBackgroundColor.push(this.hoverColors[color]);
                        color += 1;
                        if (!this.backgroundColors[color]) {
                            color = 0;
                        }
                    }
                    return output;
                };
                Data.prototype.formatTimeline = function () {
                    var output = {
                        "labels": [],
                        "datasets": [{
                                label: "Messages",
                                fill: true,
                                backgroundColor: this.backgroundColors[9],
                                data: []
                            }]
                    };
                    for (var year in this.data) {
                        for (var month = 0; month < 12; month += 1) {
                            output.labels.push(this.months[month] + ", " + year);
                            output.datasets[0].data.push(0);
                            for (var day in this.data[year][month]) {
                                output.datasets[0].data[output.datasets[0].data.length - 1] += this.data[year][month][day];
                            }
                        }
                    }
                    while (output.datasets[0].data[0] === 0) {
                        output.datasets[0].data.shift();
                        output.labels.shift();
                    }
                    while (output.datasets[0].data[output.datasets[0].data.length - 1] === 0) {
                        output.datasets[0].data.pop();
                        output.labels.pop();
                    }
                    return output;
                };
                Data.prototype.formatMultiTimeline = function () {
                    var output = {
                        "labels": [],
                        "datasets": []
                    };
                    var minYear = new Date().getFullYear() + 1;
                    var maxYear = 0;
                    for (var _i = 0, _a = this.data; _i < _a.length; _i++) {
                        var hangout = _a[_i];
                        for (var year in hangout.timeline) {
                            var y = Number.parseInt(year);
                            if (y < minYear) {
                                minYear = y;
                            }
                            else if (y > maxYear) {
                                maxYear = y;
                            }
                        }
                    }
                    var color = 0;
                    for (var _b = 0, _c = this.data; _b < _c.length; _b++) {
                        var hangout = _c[_b];
                        var dataset = {
                            label: hangout.name,
                            fill: false,
                            borderColor: this.backgroundColors[color],
                            backgroundColor: this.backgroundColors[color],
                            data: []
                        };
                        color += 1;
                        if (!this.backgroundColors[color]) {
                            color = 0;
                        }
                        for (var year = minYear; year <= maxYear; year += 1) {
                            for (var month = 0; month < 12; month += 1) {
                                dataset.data.push(0);
                                if (hangout.timeline[year]) {
                                    if (hangout.timeline[year][month]) {
                                        for (var day in hangout.timeline[year][month]) {
                                            dataset.data[dataset.data.length - 1] += hangout.timeline[year][month][day];
                                        }
                                    }
                                }
                                if (dataset.data[dataset.data.length - 1] === 0) {
                                    dataset.data[dataset.data.length - 1] = NaN;
                                }
                            }
                        }
                        output.datasets.push(dataset);
                    }
                    for (var year = minYear; year <= maxYear; year += 1) {
                        for (var month = 0; month < 12; month += 1) {
                            output.labels.push(this.months[month] + ", " + year);
                        }
                    }
                    return output;
                };
                return Data;
            }());
            exports_1("Data", Data);
        }
    }
});
