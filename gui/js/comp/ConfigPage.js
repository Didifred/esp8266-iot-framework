import React, { useEffect } from "react";
import PropTypes from "prop-types";

import Config from "../configuration.json";
import { obj2bin } from "../functions/configHelpers";

import { Form, Button, PageTitle } from "./UiComponents";
import { DashboardItems } from "./DashboardItems";

let loc;
if (Config.find(entry => entry.name === "language")) {
    loc = require("./../lang/" + Config.find(entry => entry.name === "language").value + ".json");
} else {
    loc = require("./../lang/en.json");
}

export function ConfigPage(props) {
    
    useEffect(() => {
        document.title = loc.titleConf;
    }, []);
   
    const confItems = <DashboardItems items={Config} data={props.configData} />;    

    let buttonSave;
    let buttonRefresh;
    if (Object.keys(props.configData).length > 0) {
        buttonSave = <Button onClick={() =>
            fetch(`${props.API}/api/config/set`, {
                method: "post",
                body: form2bin(),                
            }).then((response) => { return response.status; })
                .then((status) => {
                    if (status == 200) {props.requestUpdate();}
                })         
        }>{loc.globalSave}</Button>;

        buttonRefresh = <Button onClick={() =>
            fetch(`${props.API}/api/config/refresh`, {
                method: "post",
                body: form2bin(),                
            }).then((response) => { return response.status; })
                .then((status) => {
                    if (status == 200) {props.requestUpdate();}
                })         
        }>{loc.globalRefresh}</Button>;
    }

    const form = <><Form>
        {confItems}
    </Form>
    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        {buttonSave}
        {buttonRefresh}
    </div>        
    </>;

    return <><PageTitle title={loc.titleConf} /><p>{form}</p></>;

    function form2bin() {
        const newData = {};

        for (let i = 0; i < Config.length; i++) {
            if (Config[i].hidden) {
                newData[Config[i].name] = props.configData[Config[i].name];
                continue;
            }

            switch (Config[i].type) {
                case "bool":
                    newData[Config[i].name] = document.getElementById(Config[i].name).checked;
                    break;
                
                default:
                    if (Config[i].type != "separator" && Config[i].type != "label" && Config[i].type != "header") {
                        newData[Config[i].name] = document.getElementById(Config[i].name).value;
                    }
            }
        }
        
        return obj2bin(newData, props.binSize, Config);
        
    }
    
}

ConfigPage.propTypes = {
    API: PropTypes.string,
    binSize: PropTypes.number,
    configData: PropTypes.object,
    requestUpdate: PropTypes.func,
};
