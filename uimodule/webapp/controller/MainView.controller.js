sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel"],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("com.gustavomartins.project1.controller.MainView", {
            

            onInit: function () {

                this.byId("artistsTable").setBusy(true);

                var oTemp = {
                    artists:[]
                };
                var oModel = new JSONModel(oTemp);
                this.getView().setModel(oModel);

                this._oModel = this.getView().getModel();
                this._oModel.loadData("https://api.artic.edu/api/v1/agents/search?query[term][is_artist]=true&fields=id,title,birth_date,death_date,is_artist&limit=100&page=1",null, true, "GET", true);
                this._oModel.attachRequestCompleted(this.onRequestCompleted, this);
            },

            onRequestCompleted: function(oEvt) {
                
                
                
                this._prepareModel(oEvt);
                

            },

            onFilterArtist: function (oEvent) {
                this.byId("artistsTable").setBusy(true);
                var sQuery = oEvent.getParameter("query");
                var sUrl = "";

                if(sQuery){
                    sUrl = "https://api.artic.edu/api/v1/agents/search?query[term][is_artist]=true&fields=id,title,birth_date,death_date,is_artist&q="+ sQuery +"&limit=100&page=1";
                }else{
                    sUrl = "https://api.artic.edu/api/v1/agents/search?query[term][is_artist]=true&fields=id,title,birth_date,death_date,is_artist&limit=100&page=1";
                }

                var oTemp = {
                    artists: []
                };
                this._oModel.setProperty("/", oTemp);

                this._oModel.loadData(sUrl, null, true, "GET", true);
                this._oModel.attachRequestCompleted(function(){
                    if(oEvent.getParameters().sId)
                    this._prepareModel(this);
                }, this);
                
            },

            _prepareModel: function (oEvt) {
                var oArtistsArray = this._oModel.getProperty("/artists");
                var iElements = Object.keys(this._oModel.getProperty("/data")).length;
                var iCurrentPage =this._oModel.getProperty("/pagination/current_page");
                var iTotalPages =this._oModel.getProperty("/pagination/total_pages");
                var iNextPage = Object.assign(iCurrentPage);
                var sNextPage = oEvt.getParameters().url.slice(0,-1);

                if(iElements > 0){
                    for(var i = 0; i < iElements; i++){
                        oArtistsArray.push({
                            id: this._oModel.getProperty("/data/"+ i + "/id"),
                            title: this._oModel.getProperty("/data/"+ i + "/title"),
                            birth_date: this._oModel.getProperty("/data/"+ i + "/birth_date"),
                            death_date: this._oModel.getProperty("/data/"+ i + "/death_date")
                        });
                    }
                    this._oModel.setProperty("/artists", oArtistsArray);
                }

                if (iCurrentPage < 10 && iCurrentPage < iTotalPages){
                    iNextPage = iNextPage + 1;
                    sNextPage = sNextPage + iNextPage;
                    this._oModel.loadData(sNextPage, null, true, "GET", true);
                }

                if(iCurrentPage = iTotalPages){
                    this.byId("artistsTable").setBusy(false);
                }
            },

            onItemPress: function(oEvent){
                var oRouter = this.getOwnerComponent().getRouter();
                var oItem = oEvent.getParameters().listItem;
                var oContext = oItem.getBindingContext();
                
                oRouter.navTo("RouteArtistDetail", {
                    artistId: window.encodeURIComponent(oContext.getProperty("id"))
                });
            }
            
        });
    },
);
