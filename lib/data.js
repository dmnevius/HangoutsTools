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
                        "#b71c1c",
                        "#880e4f",
                        "#4a148c",
                        "#311b92",
                        "#1a237e",
                        "#0d47a1",
                        "#01579b",
                        "#006064",
                        "#004d40",
                        "#1b5e20",
                        "#33691e",
                        "#827717",
                        "#f57f17",
                        "#ff6f00",
                        "#e65100",
                        "#bf360c",
                        "#3e2723",
                        "#212121",
                        "#263238"
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
                    var months = [
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
                    for (var year in this.data) {
                        for (var month = 0; month < 12; month += 1) {
                            output.labels.push(months[month] + ", " + year);
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
                return Data;
            }());
            exports_1("Data", Data);
        }
    }
});
