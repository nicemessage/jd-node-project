const colorStyle: string[] = ['#2D68FF', '#6DB247', '#FFB630', '#F15151', '#A1A5AF', '#2DC2FF', '#ABD443', '#FFD400', '#FF009E', '#D2D2D2'];
const chartTool: any = {
    // 柱状图
    bar(name: string, chartsData: any[]): any {
        const x: any[] = Array.from(chartsData, ({ name }) => name);
        const y: any[] = Array.from(chartsData, ({ value }) => value);
        return {
            title: {
                text: name,
                textStyle: {
                    // ---主标题内容样式
                    color: '#333',
                    fontSize: 12
                },
                padding: [20, 0, 0, 24] // ---标题位置,因为图形是是放在一个 dom 中,因此用 padding 属性来定位
            },
            tooltip: {
                trigger: 'item',
                formatter: '{b}：{c}'
            },
            grid: {
                show: false,
                top: '20%',
                left: '24px',
                right: '24px',
                bottom: '5%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: x,
                axisTick: {
                    alignWithLabel: true,
                    lineStyle: {
                        color: '#BFBFBF'
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#BFBFBF'
                    }
                },
                axisLabel: {
                    color: '#333'
                }
            },
            yAxis: {
                type: 'value',
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    color: '#333'
                },
                splitLine: {
                    lineStyle: {
                        color: '#e9e9e9',
                        type: 'dashed'
                    }
                }
            },
            dataZoom: {
                type: 'slider',
                show: true,
                realtime: true,
                bottom: 10,
                start: 0,
                end: 100,
                showDetail: false
            },
            series: [
                {
                    name: name,
                    type: 'bar',
                    barWidth: '20px',
                    label: {
                        // 每个柱子顶端显示数值
                        normal: {
                            show: true,
                            position: 'top',
                            formatter: (data: any) => {
                                let num = 0;
                                y.forEach(item => {
                                    num += parseInt(item);
                                });
                                if (num == 0) {
                                    return '0%';
                                } else {
                                    return `${(((data.value / num) * 100) as number).toFixed(2)}%`;
                                }
                            }
                        }
                    },
                    data: y,
                    itemStyle: {
                        // 通常情况下：
                        normal: {
                            // 每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                            color: (params: any) => {
                                return colorStyle[params.dataIndex % colorStyle.length];
                            }
                        }
                    }
                }
            ]
        };
    },
    // chartSubTtile 男/女
    pie(name: string, chartsData: any[]): any {
        return {
            title: {
                text: name,
                textStyle: {
                    // ---主标题内容样式
                    color: '#333',
                    fontSize: 12
                },
                padding: [20, 0, 0, 24] // ---标题位置,因为图形是是放在一个 dom 中,因此用 padding 属性来定位
            },
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c} ({d}%)'
            },
            legend: {
                type: 'scroll',
                top: '15%',
                left: '10%',
                icon: 'circle'
            },
            series: [
                {
                    name: name,
                    type: 'pie',
                    center: ['50%', '60%'],
                    hoverAnimation: false,
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    label: {
                        position: 'inner',
                        color: '#000',
                        formatter: (data: any) => {
                            if (data.percent < 5) {
                                return '';
                            } else {
                                return `${data.percent}%`;
                            }
                        }
                    },
                    itemStyle: {
                        color: (params: any) => {
                            return colorStyle[params.dataIndex % colorStyle.length];
                        }
                    },
                    data: chartsData
                }
            ]
        };
    },
    // 散点图
    scatter(name: string, chartsData: any[]): any {
        const x: any[] = Array.from(chartsData, ({ name }) => name);
        const y: any[] = Array.from(chartsData, ({ value }) => value);
        return {
            title: {
                text: name,
                textStyle: {
                    // ---主标题内容样式
                    color: '#333',
                    fontSize: 12
                },
                padding: [20, 0, 0, 24] // ---标题位置,因为图形是是放在一个 dom 中,因此用 padding 属性来定位
            },
            grid: {
                show: false,
                top: '20%',
                left: '24px',
                right: '24px',
                bottom: '5%',
                containLabel: true
            },
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c}'
            },
            xAxis: {
                type: 'category',
                data: x,
                axisTick: {
                    alignWithLabel: true,
                    lineStyle: {
                        color: '#BFBFBF'
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#BFBFBF'
                    }
                },
                axisLabel: {
                    color: '#333'
                }
            },
            yAxis: {
                type: 'value',
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    color: '#333'
                },
                splitLine: {
                    lineStyle: {
                        color: '#e9e9e9',
                        type: 'dashed'
                    }
                }
            },
            dataZoom: {
                type: 'slider',
                show: true,
                realtime: true,
                bottom: 10,
                start: 0,
                end: 100,
                showDetail: false
            },
            series: [
                {
                    type: 'scatter',
                    name: name,
                    symbolSize: 30,
                    label: {
                        normal: {
                            show: true,
                            color: '#fff',
                            fontSize: 10,
                            formatter: (param: any) => {
                                param.value = String(param.value);
                                if (param.value.length <= 2) {
                                    return param.value;
                                } else {
                                    return `${param.value.slice(0, 2)}...`;
                                }
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: (params: any) => {
                                return colorStyle[params.dataIndex % colorStyle.length];
                            }
                        }
                    },
                    data: y
                }
            ]
        };
    },
    // 折线图
    line(name: string, chartsData: any[]): any {
        const x: any[] = Array.from(chartsData, ({ name }) => name);
        const y: any[] = Array.from(chartsData, ({ value }) => value);
        return {
            title: {
                text: name,
                textStyle: {
                    // ---主标题内容样式
                    color: '#333',
                    fontSize: 12
                },
                padding: [20, 0, 0, 24] // ---标题位置,因为图形是是放在一个 dom 中,因此用 padding 属性来定位
            },
            grid: {
                show: false,
                top: '20%',
                left: '24px',
                right: '24px',
                bottom: '5%',
                containLabel: true
            },
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c}'
            },
            xAxis: {
                type: 'category',
                data: x,
                axisTick: {
                    alignWithLabel: true,
                    lineStyle: {
                        color: '#BFBFBF'
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#BFBFBF'
                    }
                },
                axisLabel: {
                    color: '#333'
                }
            },
            yAxis: {
                type: 'value',
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    color: '#333'
                },
                splitLine: {
                    lineStyle: {
                        color: '#e9e9e9',
                        type: 'dashed'
                    }
                }
            },
            dataZoom: {
                type: 'slider',
                show: true,
                realtime: true,
                bottom: 10,
                start: 0,
                end: 100,
                showDetail: false
            },
            series: [
                {
                    name: name,
                    type: 'line',
                    symbol: 'circle',
                    symbolSize: 8,
                    smooth: true,
                    itemStyle: {
                        normal: {
                            color: '#237aff'
                        }
                    },
                    lineStyle: {
                        normal: {
                            color: '#237aff'
                        }
                    },
                    data: y
                }
            ]
        };
    }
};

export default chartTool;
