/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React, { createRef, useEffect } from 'react';
import { SupersetBulletChartV7Props, SupersetBulletChartV7StylesProps } from './types';
import * as d3 from 'd3';
import * as d3Scale from 'd3-scale';
import { styled, getCategoricalSchemeRegistry } from '@superset-ui/core';
const categorialSchemeRegistry = getCategoricalSchemeRegistry();

// The following Styles component is a <div> element, which has been styled using Emotion
// For docs, visit https://emotion.sh/docs/styled

// Theming variables are provided for your use via a ThemeProvider
// imported from @superset-ui/core. For variables available, please visit
// https://github.com/apache-superset/superset-ui/blob/master/packages/superset-ui-core/src/style/index.ts

/**
 * ******************* WHAT YOU CAN BUILD HERE *******************
 *  In essence, a chart is given a few key ingredients to work with:
 *  * Data: provided via `props.data`
 *  * A DOM element
 *  * FormData (your controls!) provided as props by transformProps.ts
 */

const Styles = styled.div<SupersetBulletChartV7StylesProps>`
.checkbox-container {
  display: block;
  position: relative;
  padding-left: 45px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 10px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  cursor:pointer;
}
.checkbox-container .square {
  position: absolute;
  top: 1px;
  left: 22px;
  height: 12px;
  width: 12px;
}
.checkbox-contaner input[type='checkbox'] {
  width: 12px;
  height: 12px;
}

/* Hide the browser's default checkbox */
.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 1px;
  left: 0;
  height: 12px;
  width: 12px;
  background-color: #eee;
}

/* On mouse-over, add a grey background color */
.checkbox-container:hover input ~ .checkmark {
  background-color: #ccc;
}

/* When the checkbox is checked, add a blue background */
.checkbox-container input:checked ~ .checkmark {
  background-color: #2196F3;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.checkbox-container .checkmark:after {
  left: 4px;
  top: 1px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
`;
export default function SupersetBulletChartV7(props: SupersetBulletChartV7Props) {
  // height and width are the height and width of the DOM element as it exists in the dashboard.
  // There is also a `data` prop, which is, of course, your DATA 🎉
  const { data, height, width, colorScheme, bulletColorScheme, orderDesc } = props;
  let dataToRender: any;
  let dataToRenderOne: any;
  const rootElem = createRef<HTMLDivElement>();
  // console.log('props', props);
 orderDesc
    ? data.sort((a: any, b: any) => b.orderby - a.orderby)
    :  data.sort((a: any, b: any) => a.orderby - b.orderby);
  // custom colors theme
  let customColors: string[];
  const colorsValues = categorialSchemeRegistry.values();
  let selected = true;
  const filterColors: any = colorsValues.filter(
    (c: any) => c.id === colorScheme,
  );
  const findLegendColorScheme: any = colorsValues.filter(
    (c: any) => c.id === bulletColorScheme,
  );

  if (filterColors[0]) {
    customColors = [...filterColors[0].colors];
  }
  let legendBulletColor: Array<string> = [];
  if (findLegendColorScheme[0]) {
    legendBulletColor = [...findLegendColorScheme[0].colors];
  }

  legendBulletColor = [
    '#FAE849',
    '#CDDA47',
    '#92C557',
    '#58B25C',
    '#139C8F',
    '#13BED4',
    '#15ACF1',
    '#329CF0',
    '#4D5DB8',
    '#7047B9',
    '#A136B3',
    '#E72F6E',
    '#F14F43',
    '#FB6131',
    '#FB9E14',
    '#FBC319',
    '#006262',
    '#004242',
    '#536872',
    '#6E7F80',
    '#838996',
    '#8DA399'
  ];

  // find records having percentage less than 5
  function findMaricPossibleLessThanFive(data: any) {
    return data.filter((d: any) => d.percent < 5);
  }

  //create unique array of given key 
  const createUniqueArray = (data: any, key: string) => {
    const unique = [];
    const distinct = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i][key]) {
        if (!unique[data[i][key]]) {
          distinct.push(data[i]);
          unique[data[i][key]] = 1;
        }
      }
    }
    return distinct;
  }
  //create unique array of given key 
  const assignColorToCompany = (companies: any, colors: any) => {
    companies.forEach((cp: any, cpIndex: number) => {
      cp.color = colors[cpIndex];
      cp.selected = true;
    })
    return companies;
  }

  // map matricvaue to company i.e YES is present in only Denali Water Solutions LLC count  = 1
  const matricValueCountForCompany = (uniqueMatricValues: any, uniqueCompanyValues: any) => {
    const data: any = [];
    let cumulative = 0;
    uniqueMatricValues.forEach((umv: any) => {
      data.push({
        ...{
          metricvalue: umv.metricvalue,
          company: umv.company,
          period: umv.period,
          orderby: umv.orderby,
          cumulative: cumulative - umv.metricpossiblevalues,
          companies: uniqueCompanyValues.filter((ucv: any) => ucv.metricvalue === umv.metricvalue)
        }, ...{ metricpossiblevalues: uniqueCompanyValues.filter((ucv: any) => ucv.metricvalue === umv.metricvalue).length }
      })
    });
    return data;
  }
  // calculate percentage to draw chart
  const calculateData = (data: any, total: any) => {
    let cumulative = 0;
    return data
      .map((d: any) => {
        cumulative += d.metricpossiblevalues;
        return {
          metricpossiblevalues: d.metricpossiblevalues,
          cumulative: cumulative - d.metricpossiblevalues,
          metricvalue: d.metricvalue,
          company: d.company,
          period: d.period,
          orderby: d.orderby,
          companies: d.companies,
          metricpossible: d.metricpossiblevalues,
          percent: ((d.metricpossiblevalues / total) * 100).toFixed(2),
        };
      })
      .filter((d: any) => d.metricpossiblevalues > 0);
  };

  //add year key-value to records
  const addYearToRecord = (data: any) => {
    const records: any = [];
    data.forEach((d: any) => {
      records.push({
        ...d,
        year: parseInt(d.period.substr(d.period.length - 4)),
      });
    });
    return records;
  };

  // Often, you just want to get a hold of the DOM and go nuts.
  // Here, you can do that with createRef, and the useEffect hook.
  useEffect(() => {
    // const root = rootElem.current as HTMLElement;
    d3.select('#graphic').selectAll('svg').remove();
    d3.select('#graphic').selectAll('.checkboxes').remove();
   /*  d3.selectAll('input').remove();
    d3.selectAll('span').remove();
    d3.selectAll('label').remove(); */
    dataToRender = [...calculatedData];
    console.log('dataToRender, dataToRender', dataToRender, dataToRender);
    render(dataToRender, dataToRender);
    selected = true;
  }, [props, data, height, width, colorScheme, bulletColorScheme]);

  const records = addYearToRecord(props.data);
  let uniqueCompanies = createUniqueArray(records, 'company');
  uniqueCompanies = assignColorToCompany(uniqueCompanies, legendBulletColor);
  const uniqueMatricValues = createUniqueArray(uniqueCompanies, 'metricvalue');
  const _data = matricValueCountForCompany(uniqueMatricValues, uniqueCompanies);
  //calculate total sum of matric possible value
  const total = d3.sum(_data, (d: any) => d.metricpossiblevalues);
  const calculatedData = calculateData(_data, total);

  // attache update function to checkbox
  const attachUpdateFunctionToCheckbox = (uniqueCompanies: any) => {
    uniqueCompanies.map((d: any, index: number) => {
      d3.select("#myCheckbox" + index).on("change", update);
    });
  }


  // update function
  const update = (data: any) => {
    const selectAllCheckBox: any = Array.from(d3.selectAll(".checkboxes"));
    const selectedCheckboxes = selectAllCheckBox.filter((d: any) => d.checked === true);
    const records = addYearToRecord(props.data);
    const uniCompanies = createUniqueArray(records, 'company');
    const companyWithColor = assignColorToCompany(uniCompanies, legendBulletColor);
    const uniqueMatricValues = createUniqueArray(uniqueCompanies, 'metricvalue');
    const _data = matricValueCountForCompany(uniqueMatricValues, uniqueCompanies);

    let filteredCompanies = addRemoveUniqueCompaniesOnCheckBoxUpdate(companyWithColor, selectedCheckboxes);
    const updatedData = matricValueCountForCompany(uniqueMatricValues, filteredCompanies);
    //calculate total sum of matric possible value
    const total = d3.sum(updatedData, (d: any) => d.metricpossiblevalues);
    const totalOriginal = d3.sum(_data, (d: any) => d.metricpossiblevalues);
    const calculatedData = calculateData(updatedData, total);
    const calculatedDataOriginal = calculateData(_data, totalOriginal);
    dataToRenderOne = [...calculatedData];
    dataToRender = [...calculatedDataOriginal];
    d3.select('#graphic').selectAll('svg').remove();
    d3.select('#graphic').selectAll('.checkboxes').remove();
    // console.log('dataToRender, dataToRenderOne', dataToRender, dataToRenderOne);
    render(dataToRender, dataToRenderOne);
  }

  // add remove company from data on checkbox update
  const addRemoveUniqueCompaniesOnCheckBoxUpdate = (data: any, filteredCheckboxes: any) => {
    const indexes = filteredCheckboxes.map((d: any) => parseInt(d.id.substr(d.id.length - 1)));
    const filteredData: any = [];
    data.forEach((d: any, index: number) => {
      if (indexes.indexOf(index) !== -1) {
        filteredData.push(d);
      }
    });
    return filteredData;
  }



  // wrap text
  function wrap(txt: any, data: any) {
    const width = data;
    const text = d3.select(txt);
    const words = text.text().split(/\s+/).reverse();
    let word;
    let line: any = [];
    let lineNumber = 0;
    const lineHeight = 1.1; // ems
    const x = text.attr('x');
    const y = text.attr('y');
    const dy = parseFloat(text.attr('dy')) || 0;
    let tspan: any = text
      .text('')
      .append('tspan')
      .attr('x', x)
      .attr('y', y)
      .attr('dy', dy + 'em');

    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(' '));
      const tspanWidth = tspan.node().getComputedTextLength() + 1;
      if ((tspanWidth + 10) > width) {
        line.pop();
        tspan.text(line.join(' '));
        line = [word];
        tspan = text
          .append('tspan')
          .attr('x', x)
          .attr('y', y)
          .attr('dy', ++lineNumber * lineHeight + dy + 'em')
          .text(word);
      }
    }
  };
  const render = (data: any, indicatorData: any) => {
    const config: any = {
      f: d3.format('.1f'),
      margin: {
        top: 10,
        right: 0,
        bottom: 0,
        left: 10,
      },
      barHeight: 20,
    };
    let h = height;
    let w = width;
    const halfBarHeight = config.barHeight;

    const noOfRecordsLessThanFivePercente = findMaricPossibleLessThanFive(data);
    if (noOfRecordsLessThanFivePercente.length < 6) {
      h = 130
    }
    if (noOfRecordsLessThanFivePercente.length < 3) {
      h = 110
    }
    if (noOfRecordsLessThanFivePercente.length === 1) {
      h = 80
    }
    if (data.length === 1) {
      h = 70
    }

    // wrap text manually
    const getMetricPossible = (rectData: any) => {
      const rectangles: any = selection.selectAll('rect') || null;
      rectData.each(function (this: any) {
        const rects = Array.from(rectangles);
        const filterVal: any = rects.filter(
          (d: any, eleIndex: number) => rectData._groups[0].indexOf(this) === eleIndex,
        );
        if (filterVal.length > 0) {
          wrap(this, parseFloat(filterVal[0].attributes[4].value) + 5);
        }
      });
    };

    let previousWidth = 0;
    const getXAsPerOriginalData = (dt: any, count: any, dtIndex: any, innerndicatorIndex: any) => {
      const filteredValue = data.filter((d: any) => d.metricvalue === dt.metricvalue);
      const x = Math.abs((xScale(filteredValue[0].cumulative)! + xScale(filteredValue[0].metricpossiblevalues)! / 2));
      previousWidth = x;
      if (previousWidth !== x) {
        previousWidth = x;
      }
      return x + (innerndicatorIndex * 10);
      // return (xScale(dt.cumulative)! + xScale(dt.metricpossiblevalues)! / 2) + (count  + (innerndicatorIndex * 10));
    }

    // set up scales for horizontal placement
    const xScale = d3Scale
      .scaleLinear()
      .domain([0, total])
      .range([0, w - 20]);

    const selection = d3
      .select('#graphic')
      .append('svg')
      .attr('id', '#svg' + 1)
      .attr('width', w)
      .attr('height', h)
      .append('g')
      .attr('transform', 'translate(' + config.margin.left + ',' + config.margin.top + ')');

    // stack rect for each data value
    selection
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'rect-stacked')
      .attr('x', (d: any) => xScale(d.cumulative)!)
      .attr('y', 20)
      .attr('height', config.barHeight)
      .attr('width', (d: any) => xScale(d.metricpossiblevalues)!)
      .style('fill', (d, i) => customColors[i + 4])
      .text((d: any) =>
        config.f(d.percent) < 5
          ? config.f(d.percent) + '%, ' + ' ' + d.metricpossiblevalues
          : config.f(d.percent) + '%',
      );

    let count = 0;
    indicatorData.map((dt: any, dtIndex: number) => {
      selection
        .selectAll('.indicator-row-two' + count)
        .data(dt.companies)
        .enter()
        .append('text')
        .attr('class', 'indicator-row-two' + count)
        .attr('text-anchor', 'middle')
        .attr('font-size', '14px')
        .attr('fill', (d: any) => d.color)
        .attr('y', 20)
        .attr(
          'x',
          (d: any, innerndicatorIndex: number) => {
            count++;
            // return xScale(dt.cumulative)! + xScale(dt.metricpossiblevalues)! / 2 + (count  + innerndicatorIndex * 10);
            return getXAsPerOriginalData(dt, count, dtIndex, innerndicatorIndex);
          },
        )
        .text((d: any) => '▼');
    });

    // add the labels below bar
    selection
      .selectAll('text-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'text-label')
      .attr('text-anchor', 'middle')
      .attr('font-size', '9px')
      .attr(
        'x',
        (d: any) =>
          xScale(d.cumulative)! + xScale(d.metricpossiblevalues)! / 2 - 12,
      )
      .attr('y', 50)
      .style('fill', '#000')
      .attr('width', (d: any) => xScale(d.metricpossiblevalues)! / 3)
      .text((d: any) => d.metricvalue + ', ' + config.f(d.percent) + '%')
      .call(getMetricPossible);
      // setCheckboxes();
      attachUpdateFunctionToCheckbox(uniqueCompanies);
  }
  const setCheckboxes = ()=> {
    return(
      uniqueCompanies.map((data: any, index: number) => {
        return (<div>
          <label className="checkbox-container" key={index}>
            <span className='square' style={{ backgroundColor: data.color }}></span>
            <input type="checkbox" className='checkboxes' id={'myCheckbox' + index} data-tag={data.company}  value={data.selected} defaultChecked={data.selected} /> {data.company}
            <span className="checkmark"></span>
          </label>
        </div>);
      })
    )
  }

  return (
    <Styles
      ref={rootElem}
      boldText={props.boldText}
      headerFontSize={props.headerFontSize}
      height={height}
      width={width}
    >
      <div id='graphic'></div>
      {setCheckboxes()}
    </Styles>
  )
}