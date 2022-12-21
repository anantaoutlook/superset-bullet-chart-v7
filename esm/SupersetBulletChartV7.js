var _templateObject;

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _taggedTemplateLiteralLoose(strings, raw) { if (!raw) { raw = strings.slice(0); } strings.raw = raw; return strings; }

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
import * as d3 from 'd3';
import * as d3Scale from 'd3-scale';
import { styled, getCategoricalSchemeRegistry } from '@superset-ui/core';
var categorialSchemeRegistry = getCategoricalSchemeRegistry(); // The following Styles component is a <div> element, which has been styled using Emotion
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

var Styles = styled.div(_templateObject || (_templateObject = _taggedTemplateLiteralLoose(["\n.checkbox-container {\n  display: block;\n  position: relative;\n  padding-left: 45px;\n  margin-bottom: 12px;\n  cursor: pointer;\n  font-size: 10px;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  cursor:pointer;\n}\n.checkbox-container .square {\n  position: absolute;\n  top: 1px;\n  left: 22px;\n  height: 12px;\n  width: 12px;\n}\n.checkbox-contaner input[type='checkbox'] {\n  width: 12px;\n  height: 12px;\n}\n\n/* Hide the browser's default checkbox */\n.checkbox-container input {\n  position: absolute;\n  opacity: 0;\n  cursor: pointer;\n  height: 0;\n  width: 0;\n}\n\n/* Create a custom checkbox */\n.checkmark {\n  position: absolute;\n  top: 1px;\n  left: 0;\n  height: 12px;\n  width: 12px;\n  background-color: #eee;\n}\n\n/* On mouse-over, add a grey background color */\n.checkbox-container:hover input ~ .checkmark {\n  background-color: #ccc;\n}\n\n/* When the checkbox is checked, add a blue background */\n.checkbox-container input:checked ~ .checkmark {\n  background-color: #2196F3;\n}\n\n/* Create the checkmark/indicator (hidden when not checked) */\n.checkmark:after {\n  content: \"\";\n  position: absolute;\n  display: none;\n}\n\n/* Show the checkmark when checked */\n.checkbox-container input:checked ~ .checkmark:after {\n  display: block;\n}\n\n/* Style the checkmark/indicator */\n.checkbox-container .checkmark:after {\n  left: 4px;\n  top: 1px;\n  width: 4px;\n  height: 8px;\n  border: solid white;\n  border-width: 0 2px 2px 0;\n  -webkit-transform: rotate(45deg);\n  -ms-transform: rotate(45deg);\n  transform: rotate(45deg);\n}\n"])));
export default function SupersetBulletChartV7(props) {
  // height and width are the height and width of the DOM element as it exists in the dashboard.
  // There is also a `data` prop, which is, of course, your DATA 🎉
  var {
    data,
    height,
    width,
    colorScheme,
    bulletColorScheme,
    orderDesc
  } = props;
  var dataToRender;
  var dataToRenderOne;
  var rootElem = /*#__PURE__*/createRef(); // console.log('props', props);

  orderDesc ? data.sort((a, b) => b.orderby - a.orderby) : data.sort((a, b) => a.orderby - b.orderby); // custom colors theme

  var customColors;
  var colorsValues = categorialSchemeRegistry.values();
  var selected = true;
  var filterColors = colorsValues.filter(c => c.id === colorScheme);
  var findLegendColorScheme = colorsValues.filter(c => c.id === bulletColorScheme);

  if (filterColors[0]) {
    customColors = [...filterColors[0].colors];
  }

  var legendBulletColor = [];

  if (findLegendColorScheme[0]) {
    legendBulletColor = [...findLegendColorScheme[0].colors];
  }

  legendBulletColor = ['#FAE849', '#CDDA47', '#92C557', '#58B25C', '#139C8F', '#13BED4', '#15ACF1', '#329CF0', '#4D5DB8', '#7047B9', '#A136B3', '#E72F6E', '#F14F43', '#FB6131', '#FB9E14', '#FBC319', '#006262', '#004242', '#536872', '#6E7F80', '#838996', '#8DA399']; // find records having percentage less than 5

  function findMaricPossibleLessThanFive(data) {
    return data.filter(d => d.percent < 5);
  } //create unique array of given key 


  var createUniqueArray = (data, key) => {
    var unique = [];
    var distinct = [];

    for (var i = 0; i < data.length; i++) {
      if (data[i][key]) {
        if (!unique[data[i][key]]) {
          distinct.push(data[i]);
          unique[data[i][key]] = 1;
        }
      }
    }

    return distinct;
  }; //create unique array of given key 


  var assignColorToCompany = (companies, colors) => {
    companies.forEach((cp, cpIndex) => {
      cp.color = colors[cpIndex];
      cp.selected = true;
    });
    return companies;
  }; // map matricvaue to company i.e YES is present in only Denali Water Solutions LLC count  = 1


  var matricValueCountForCompany = (uniqueMatricValues, uniqueCompanyValues) => {
    var data = [];
    var cumulative = 0;
    uniqueMatricValues.forEach(umv => {
      data.push(_extends({}, {
        metricvalue: umv.metricvalue,
        company: umv.company,
        period: umv.period,
        orderby: umv.orderby,
        cumulative: cumulative - umv.metricpossiblevalues,
        companies: uniqueCompanyValues.filter(ucv => ucv.metricvalue === umv.metricvalue)
      }, {
        metricpossiblevalues: uniqueCompanyValues.filter(ucv => ucv.metricvalue === umv.metricvalue).length
      }));
    });
    return data;
  }; // calculate percentage to draw chart


  var calculateData = (data, total) => {
    var cumulative = 0;
    return data.map(d => {
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
        percent: (d.metricpossiblevalues / total * 100).toFixed(2)
      };
    }).filter(d => d.metricpossiblevalues > 0);
  }; //add year key-value to records


  var addYearToRecord = data => {
    var records = [];
    data.forEach(d => {
      records.push(_extends({}, d, {
        year: parseInt(d.period.substr(d.period.length - 4))
      }));
    });
    return records;
  }; // Often, you just want to get a hold of the DOM and go nuts.
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
  var records = addYearToRecord(props.data);
  var uniqueCompanies = createUniqueArray(records, 'company');
  uniqueCompanies = assignColorToCompany(uniqueCompanies, legendBulletColor);
  var uniqueMatricValues = createUniqueArray(uniqueCompanies, 'metricvalue');

  var _data = matricValueCountForCompany(uniqueMatricValues, uniqueCompanies); //calculate total sum of matric possible value


  var total = d3.sum(_data, d => d.metricpossiblevalues);
  var calculatedData = calculateData(_data, total); // attache update function to checkbox

  var attachUpdateFunctionToCheckbox = uniqueCompanies => {
    uniqueCompanies.map((d, index) => {
      d3.select("#myCheckbox" + index).on("change", update);
    });
  }; // update function


  var update = data => {
    var selectAllCheckBox = Array.from(d3.selectAll(".checkboxes"));
    var selectedCheckboxes = selectAllCheckBox.filter(d => d.checked === true);
    var records = addYearToRecord(props.data);
    var uniCompanies = createUniqueArray(records, 'company');
    var companyWithColor = assignColorToCompany(uniCompanies, legendBulletColor);
    var uniqueMatricValues = createUniqueArray(uniqueCompanies, 'metricvalue');

    var _data = matricValueCountForCompany(uniqueMatricValues, uniqueCompanies);

    var filteredCompanies = addRemoveUniqueCompaniesOnCheckBoxUpdate(companyWithColor, selectedCheckboxes);
    var updatedData = matricValueCountForCompany(uniqueMatricValues, filteredCompanies); //calculate total sum of matric possible value

    var total = d3.sum(updatedData, d => d.metricpossiblevalues);
    var totalOriginal = d3.sum(_data, d => d.metricpossiblevalues);
    var calculatedData = calculateData(updatedData, total);
    var calculatedDataOriginal = calculateData(_data, totalOriginal);
    dataToRenderOne = [...calculatedData];
    dataToRender = [...calculatedDataOriginal];
    d3.select('#graphic').selectAll('svg').remove();
    d3.select('#graphic').selectAll('.checkboxes').remove(); // console.log('dataToRender, dataToRenderOne', dataToRender, dataToRenderOne);

    render(dataToRender, dataToRenderOne);
  }; // add remove company from data on checkbox update


  var addRemoveUniqueCompaniesOnCheckBoxUpdate = (data, filteredCheckboxes) => {
    var indexes = filteredCheckboxes.map(d => parseInt(d.id.substr(d.id.length - 1)));
    var filteredData = [];
    data.forEach((d, index) => {
      if (indexes.indexOf(index) !== -1) {
        filteredData.push(d);
      }
    });
    return filteredData;
  }; // wrap text


  function wrap(txt, data) {
    var width = data;
    var text = d3.select(txt);
    var words = text.text().split(/\s+/).reverse();
    var word;
    var line = [];
    var lineNumber = 0;
    var lineHeight = 1.1; // ems

    var x = text.attr('x');
    var y = text.attr('y');
    var dy = parseFloat(text.attr('dy')) || 0;
    var tspan = text.text('').append('tspan').attr('x', x).attr('y', y).attr('dy', dy + 'em');

    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(' '));
      var tspanWidth = tspan.node().getComputedTextLength() + 1;

      if (tspanWidth + 10 > width) {
        line.pop();
        tspan.text(line.join(' '));
        line = [word];
        tspan = text.append('tspan').attr('x', x).attr('y', y).attr('dy', ++lineNumber * lineHeight + dy + 'em').text(word);
      }
    }
  }

  ;

  var render = (data, indicatorData) => {
    var config = {
      f: d3.format('.1f'),
      margin: {
        top: 10,
        right: 0,
        bottom: 0,
        left: 10
      },
      barHeight: 20
    };
    var h = height;
    var w = width;
    var halfBarHeight = config.barHeight;
    var noOfRecordsLessThanFivePercente = findMaricPossibleLessThanFive(data);

    if (noOfRecordsLessThanFivePercente.length < 6) {
      h = 130;
    }

    if (noOfRecordsLessThanFivePercente.length < 3) {
      h = 110;
    }

    if (noOfRecordsLessThanFivePercente.length === 1) {
      h = 80;
    }

    if (data.length === 1) {
      h = 70;
    } // wrap text manually


    var getMetricPossible = rectData => {
      var rectangles = selection.selectAll('rect') || null;
      rectData.each(function () {
        var rects = Array.from(rectangles);
        var filterVal = rects.filter((d, eleIndex) => rectData._groups[0].indexOf(this) === eleIndex);

        if (filterVal.length > 0) {
          wrap(this, parseFloat(filterVal[0].attributes[4].value) + 5);
        }
      });
    };

    var previousWidth = 0;

    var getXAsPerOriginalData = (dt, count, dtIndex, innerndicatorIndex) => {
      var filteredValue = data.filter(d => d.metricvalue === dt.metricvalue);
      var x = Math.abs(xScale(filteredValue[0].cumulative) + xScale(filteredValue[0].metricpossiblevalues) / 2);
      previousWidth = x;

      if (previousWidth !== x) {
        previousWidth = x;
      }

      return x + innerndicatorIndex * 10; // return (xScale(dt.cumulative)! + xScale(dt.metricpossiblevalues)! / 2) + (count  + (innerndicatorIndex * 10));
    }; // set up scales for horizontal placement


    var xScale = d3Scale.scaleLinear().domain([0, total]).range([0, w - 20]);
    var selection = d3.select('#graphic').append('svg').attr('id', '#svg' + 1).attr('width', w).attr('height', h).append('g').attr('transform', 'translate(' + config.margin.left + ',' + config.margin.top + ')'); // stack rect for each data value

    selection.selectAll('rect').data(data).enter().append('rect').attr('class', 'rect-stacked').attr('x', d => xScale(d.cumulative)).attr('y', 20).attr('height', config.barHeight).attr('width', d => xScale(d.metricpossiblevalues)).style('fill', (d, i) => customColors[i + 4]).text(d => config.f(d.percent) < 5 ? config.f(d.percent) + '%, ' + ' ' + d.metricpossiblevalues : config.f(d.percent) + '%');
    var count = 0;
    indicatorData.map((dt, dtIndex) => {
      selection.selectAll('.indicator-row-two' + count).data(dt.companies).enter().append('text').attr('class', 'indicator-row-two' + count).attr('text-anchor', 'middle').attr('font-size', '14px').attr('fill', d => d.color).attr('y', 20).attr('x', (d, innerndicatorIndex) => {
        count++; // return xScale(dt.cumulative)! + xScale(dt.metricpossiblevalues)! / 2 + (count  + innerndicatorIndex * 10);

        return getXAsPerOriginalData(dt, count, dtIndex, innerndicatorIndex);
      }).text(d => '▼');
    }); // add the labels below bar

    selection.selectAll('text-label').data(data).enter().append('text').attr('class', 'text-label').attr('text-anchor', 'middle').attr('font-size', '9px').attr('x', d => xScale(d.cumulative) + xScale(d.metricpossiblevalues) / 2 - 12).attr('y', 50).style('fill', '#000').attr('width', d => xScale(d.metricpossiblevalues) / 3).text(d => d.metricvalue + ', ' + config.f(d.percent) + '%').call(getMetricPossible); // setCheckboxes();

    attachUpdateFunctionToCheckbox(uniqueCompanies);
  };

  var setCheckboxes = () => {
    return uniqueCompanies.map((data, index) => {
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
        className: "checkbox-container",
        key: index
      }, /*#__PURE__*/React.createElement("span", {
        className: "square",
        style: {
          backgroundColor: data.color
        }
      }), /*#__PURE__*/React.createElement("input", {
        type: "checkbox",
        className: "checkboxes",
        id: 'myCheckbox' + index,
        "data-tag": data.company,
        value: data.selected,
        defaultChecked: data.selected
      }), " ", data.company, /*#__PURE__*/React.createElement("span", {
        className: "checkmark"
      })));
    });
  };

  return /*#__PURE__*/React.createElement(Styles, {
    ref: rootElem,
    boldText: props.boldText,
    headerFontSize: props.headerFontSize,
    height: height,
    width: width
  }, /*#__PURE__*/React.createElement("div", {
    id: "graphic"
  }), setCheckboxes());
}