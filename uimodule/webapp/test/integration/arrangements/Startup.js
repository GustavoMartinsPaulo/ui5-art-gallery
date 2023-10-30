sap.ui.define(["sap/ui/test/Opa5"], function (Opa5) {
    "use strict";

    return Opa5.extend("com.gustavomartins.project1.test.integration.arrangements.Startup", {
        iStartMyApp: function () {
            this.iStartMyUIComponent({
                componentConfig: {
                    name: "com.gustavomartins.project1",
                    async: true,
                    manifest: true,
                },
            });
        },
    });
});
