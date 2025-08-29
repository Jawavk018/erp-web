import { configureStore } from "@reduxjs/toolkit";
import countryReducer from './countrySlice'
import stateReducer from './stateSlice'
import cityReducer from './citySlice'
import shipmentModeRducer from './shipmentModeSlice'
import shipmentTermRducer from './shipmentTermsSlice'
import paymentTermRducer from './paymentTermsSlice'
import currencyReducer from './currencySlice'
import fabricTypeReducer from './fabricTypeSlice'
import categoryReducer from './categorySlice'
import subCategoryReducer from './subCategorySlice'
import yarnSliceReducer from './yarnSlice'
import customerSliceReducer from './customerSlice'
import purchaseOrderSliceReducer from './purchaseOrderSlice'
import productCategorySliceReducer from './productCategorySlice'
import purchaseInwardSliceReducer from './purchaseInwardSlice'
import vendorSliceReducer from './vendorSlice'
import termsConditionsSliceReducer from './termsConditions'
import fabricMasterSliceReducer from './fabricMasterSlice'
import weavingContractsSliceReducer from './weavingContractSlice'
import weavingYarnIssueSliceReducer from './weavingYarnIssueSlice'
import consigneeSliceReducer from './consigneeSlice'
import fabricInspectionsSliceReducer from './fabricInspectionsSlice'
import invoiceSliceReducer from './invoiceSlice'
import dyeingWorkOrdeSliceReducer from './processContractSlice'
import uomSliceReducer from './uomMasterSlice'
import finishFabricSliceReducer from './finishMasterSlice'
import fabricCategorySliceReducer from './fabricCategorySlice'
import gstReducer from './gstMasterSlice'
import flangeReducer from './flangeSlice'
import emptyBeamIssueReducer from './emptyBeamIssueSlice'
import sizingPlanReducer from './sizingPlanSlice'
import salesOrderSliceReducer from './salesOrderSlice'
import knittedMastersReducer from './knittedMasterSlice'
import jobworkFabricReceiveReducer from './jobFabricReceiveSlice'
import fabricDispatchDyeingReducer from './processIssueSlice'
import warehouseReducer from './warehouseSlice'
import generatePackingReducer from './generatePackingSlice'
import SizingYarnIssueReducer from './sizingYarnIssueSlice'
import beamInwardReducer from './beamInwardSlice'
import customerInternationalReducer from './customerInternationalSlice'
import finishFabricReceiveReducer from './finishFabricReceiveSlice'
import gradeReducer from './gradeMasterSlice'
import defectReducer from './defectMasterSlice'
import processReducer from './processMasterSlice'

export const store = configureStore({
  reducer: {
    country: countryReducer,
    state: stateReducer,
    city: cityReducer,
    shipmentMode: shipmentModeRducer,
    shipmentTerms: shipmentTermRducer,
    paymentTerms: paymentTermRducer,
    currency: currencyReducer,
    fabricType: fabricTypeReducer,
    category: categoryReducer,
    subCategory: subCategoryReducer,
    yarn: yarnSliceReducer,
    customer: customerSliceReducer,
    vendor: vendorSliceReducer,
    purchaseOrder: purchaseOrderSliceReducer,
    productCategory: productCategorySliceReducer,
    salesOrder: salesOrderSliceReducer,
    purchaseInward: purchaseInwardSliceReducer,
    termsConditions: termsConditionsSliceReducer,
    fabricMaster: fabricMasterSliceReducer,
    weavingContracts: weavingContractsSliceReducer,
    weavingYarnIssue: weavingYarnIssueSliceReducer,
    consignee: consigneeSliceReducer,
    fabricInspections: fabricInspectionsSliceReducer,
    invoice: invoiceSliceReducer,
    dyeingWorkOrde: dyeingWorkOrdeSliceReducer,
    uom: uomSliceReducer,
    finishFabric: finishFabricSliceReducer,
    fabricCategoty: fabricCategorySliceReducer,
    gst: gstReducer,
    flange: flangeReducer,
    emptyBeamIssue: emptyBeamIssueReducer,
    sizingPlan: sizingPlanReducer,
    knittedMasters: knittedMastersReducer,
    JobworkFabricReceive: jobworkFabricReceiveReducer,
    fabricDispatchDyeing: fabricDispatchDyeingReducer,
    warehouse: warehouseReducer,
    generatePacking: generatePackingReducer,
    sizingYarnIssue: SizingYarnIssueReducer,
    beamInward: beamInwardReducer,
    customerInternational: customerInternationalReducer,
    finishFabricReceive: finishFabricReceiveReducer,
    grade: gradeReducer,
    defect: defectReducer,
    process: processReducer,

  },
});

// Types for dispatch and root state
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
