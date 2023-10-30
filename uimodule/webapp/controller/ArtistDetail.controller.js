sap.ui.define([
    "./BaseController",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel"
    ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, History, JSONModel) {

        return Controller.extend("com.gustavomartins.project1.controller.ArtistDetail", {
            onInit: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("RouteArtistDetail").attachPatternMatched(this._onObjectMatched, this);
            },
            _onObjectMatched: function (oEvent) {
                var iArtistId = oEvent.getParameter("arguments").artistId;

                var sArtistURL = "https://api.artic.edu/api/v1/agents/" + iArtistId;
                var sPiecesURL = "https://api.artic.edu/api/v1/artworks/search?query[term][artist_id]="+iArtistId+"&fields=id,title,thumbnail,date_display,place_of_origin,description,artwork_type_title,category_titles,classification_title,classification_titles,image_id";
                
                var oArtistModel = new JSONModel ();
                this.getView().setModel(oArtistModel,"artist");

                this._oArtistModel = this.getView().getModel("artist");
                this._oArtistModel.loadData(sArtistURL);

                var oPiecesModel = new JSONModel ();
                this.getView().setModel(oPiecesModel,"pieces");

                this._oPiecesModel = this.getView().getModel("pieces");
                this._oPiecesModel.loadData(sPiecesURL);
            },
            onNavBack: function (oEvent){
                var oHistory = History.getInstance();
                var sPreviousHash = oHistory.getPreviousHash();

                if(sPreviousHash != undefined){
                    window.history.go(-1);
                }else{
                    var oRouter = this.getOwnerComponent().getRouter();
                    oRouter.navTo("RouteMainView", {}, true);
                }
            }
        });

    }
);