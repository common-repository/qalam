if (!settings.clientId) {
    console.log("%cQalam package: your client id Dose NOT SET YET! \n Add Your Client Id in Setting -> General .", "color:red; font-size: 20px")
} else {
    if (typeof setParams == "function") {
        switch (settings.documentIdSource) {
            case "query":
                setParams(settings.clientId, null, QUERY_MODE, settings.documentSourceValue);
                break;
            case "path":
                setParams(settings.clientId, null, PATH_MODE, settings.documentSourceValue);
                break;
            default:
                setParams(settings.clientId);
        }
    } else {
        console.log("%cQalam package: CDN fail to loaded", "color:red; font-size: 20px")
    }
}