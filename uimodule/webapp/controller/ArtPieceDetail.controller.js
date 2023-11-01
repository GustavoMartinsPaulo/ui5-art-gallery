sap.ui.define([
    "./BaseController",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel"
    ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, History, JSONModel) {

        return Controller.extend("com.gustavomartins.project1.controller.ArtPieceDetail", {
            onInit: function (){
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("RouteArtPieceDetail").attachPatternMatched(this._onObjectMatched, this);
            },
            _onObjectMatched: function (oEvent) {
                var iArtPieceId = oEvent.getParameter("arguments").artPieceId;

                var sArtPieceURL = "https://api.artic.edu/api/v1/artworks/" + iArtPieceId;                

                var oArtPiecesModel = new JSONModel();
                this.getView().setModel(oArtPiecesModel, "piecesDetail");

                this._oPiecesDetailModel = this.getView().getModel("piecesDetail");
                this._oPiecesDetailModel.loadData(sArtPieceURL);
                this._oPiecesDetailModel.attachRequestCompleted(this.onRequestCompleted, this);

            },
            onRequestCompleted: function (oEvent){
                var sImageIdentifier = this._oPiecesDetailModel.getProperty("/data/image_id");
                var sArtImageURL = "https://www.artic.edu/iiif/2/" + sImageIdentifier + "/full/843,/0/default.jpg"

                this.byId("image-container").setSrc(sArtImageURL).setVisible(true);
            },
            onNavBack: function (){
                var oHistory = History.getInstance();
                var sPreviousHash = oHistory.getPreviousHash();

                this.byId("image-container").setSrc("").setVisible(false);

                if(sPreviousHash != undefined){
                    window.history.go(-1);
                }else{
                    var oRouter = this.getOwnerComponent().getRouter();
                    oRouter.navTo("RouteMainView", {}, true);
                }
            }
        });

    }
)