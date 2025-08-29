// import { Layout } from '@/components/layout/Layout';
// import { Dashboard } from '@/pages/Dashboard';
// import { CategoryMaster } from '@/pages/masters/category';
// import { ConsigneeMaster } from '@/pages/masters/consignee';
// import { CustomerMaster } from '@/pages/masters/customer';
// import FabricMaster from '@/pages/masters/fabric-master';
// import { FabricCategoryMaster } from '@/pages/masters/fabric-category';
// import { FinishFabricMaster } from '@/pages/masters/finishFabric-master';
// import { SubCategoryMaster } from '@/pages/masters/sub-category';
// import { UomMaster } from '@/pages/masters/uom-master';
// import { VendorMaster } from '@/pages/masters/vendor';
// import { YarnMaster } from '@/pages/masters/yarn-master';
// import { FabricInspection } from '@/pages/transaction/fabric-inspection';
// import { FabricInspectionDetails } from '@/pages/transaction/fabric-inspection-dtails';
// import PackingList from '@/pages/transaction/generate-packing-list';
// import { PackingListDetails } from '@/pages/transaction/generate-packing-list-details';
// import GenerateInvoice from '@/pages/transaction/invoice';
// import JobworkFabricReceive from '@/pages/transaction/jobwork-fabric-receive';
// import LotDetails from '@/pages/transaction/lot-details';
// import PieceDetails from '@/pages/transaction/piece-details';
// import { ProcessContractDetails } from '@/pages/transaction/process-contract-details';
// import { ProcessContractEntry } from '@/pages/transaction/process-contract-entry';
// import { ProcessingIssue } from '@/pages/transaction/processing-issue';
// import { ProcessingReceive } from '@/pages/transaction/processing-receive';
// import PurchaseInward from '@/pages/transaction/purchase-inward';
// import { PurchaseInwardDetails } from '@/pages/transaction/purchase-inward-details';
// import { PurchaseOrderEntry } from '@/pages/transaction/purchase-order';
// import { PurchaseOrderDetails } from '@/pages/transaction/purchase-order-details';
// import SalesOrderEntry from '@/pages/transaction/sales-order';
// import { SalesOrderDetails } from '@/pages/transaction/sales-order-details';
// import { WeavingContractDetails } from '@/pages/transaction/weaving-contract-details';
// import { WeavingContractEntry } from '@/pages/transaction/weaving-contract-entry';
// import { WeavingYarnIssue } from '@/pages/transaction/weaving-yarn-issue';
// import { Settings } from 'lucide-react';
// import { lazy, SetStateAction, Suspense, useEffect, useState } from 'react';
// import { Routes, Route, useLocation, Navigate, BrowserRouter } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import { FabricTypeMaster } from '@/pages/masters/fabric-type';
// import WovenFabricMaster from '@/pages/masters/fabric-master';
// import { GstMaster } from '@/pages/masters/gst-master';
// import SalesOrderManagement from '@/pages/masters/sales-order-management';
// import { SalesOrderExportDetails } from '@/pages/transaction/sales-order-export-details';
// import LocationManagement from '@/pages/masters/location-management';
// import FabricManagement from '@/pages/masters/fabric-management';
// import KnittedFabricMaster from '@/pages/masters/knitted-fabric-master';
// import EmptyBeamIssue from '@/pages/transaction/empty-beam-issue';
// import { SizingPlanDetails } from '@/pages/transaction/sizing-plan-details';
// import { SizingYarnIssue } from '@/pages/transaction/sizing-yarn-issue';
// import SizingManagement from '@/pages/transaction/sizing-management';
// import { FlangeMaster } from '@/pages/masters/flange-master';
// import { EmptyBeamIssueDetails } from '@/pages/transaction/empty-beam-issue-details';
// import BeamManagement from '@/pages/transaction/beam-management';
// import SizingPlanEntry from '@/pages/transaction/sizing-plan-entry';
// import BeamInwardEntry from '@/pages/transaction/beam-inward-entry';
// import { SizingYarnIssueDetails } from '@/pages/transaction/sizing-yarn-issue-details';
// import { BeamInwardDetails } from '@/pages/transaction/beam-inward-details';
// import { WeavingIssueDetails } from '@/pages/transaction/weaving-issue-details';
// import { JobworkFabricReceiveDetails } from '@/pages/transaction/jobwork-fabric-details';
// import { ProcessingIssueDetails } from '@/pages/transaction/processing-issue-details';
// import { WarehouseMaster } from '@/pages/masters/warehouse-master';
// import CustomerManagement from '@/pages/masters/customer-management';
// import { CityMaster } from '@/pages/location-masters/city-master';
// import { CountryMaster } from '@/pages/location-masters/country-master';
// import { StateMaster } from '@/pages/location-masters/state-master';
// import { ShipmentModeMaster } from '@/pages/trade-shipping-master/shipment-mode-master';
// import { ShipmentTermMaster } from '@/pages/trade-shipping-master/shipment-terms-master';
// import { CurrencyMaster } from '@/pages/trade-shipping-master/currency-master';
// import { PaymentTermsMaster } from '@/pages/trade-shipping-master/payment-terms-master';


// // const Layout = lazy(() => import('@view/layout'));

// const RoutesConfig: React.FC = () => {
//     // const location = useLocation();

//     return (
//         <div className="flex h-screen">
//             <div className="flex-1 flex flex-col overflow-hidden">
//                 <div className="flex-1 overflow-auto">
//                     <div className=''>
//                         <BrowserRouter>
//                             <Routes>
//                                 <Route path="/" element={<Layout />}>
//                                     <Route index element={<Dashboard />} />
//                                     <Route path="/masters/category" element={<CategoryMaster />} />
//                                     <Route path="/masters/sub-category" element={<SubCategoryMaster />} />
//                                     <Route path="/masters/sub-category" element={<CityMaster />} />
//                                     <Route path="/masters/yarn-master" element={<YarnMaster />} />
//                                     <Route path="/masters/woven-fabric-master" element={<WovenFabricMaster />} />
//                                     <Route path="/masters/knitted-fabric-master" element={<KnittedFabricMaster />} />
//                                     <Route path="/masters/country-master" element={<CountryMaster />} />
//                                     <Route path="/masters/state-master" element={<StateMaster />} />
//                                     <Route path="/masters/city-master" element={<CityMaster />} />
//                                     <Route path="/masters/fabric-type" element={<FabricTypeMaster />} />
//                                     <Route path="/masters/fabric-category" element={<FabricCategoryMaster />} />
//                                     <Route path="/masters/customer" element={<CustomerMaster />} />
//                                     <Route path="/masters/vendor" element={<VendorMaster />} />
//                                     <Route path="/masters/shipment-mode-master" element={<ShipmentModeMaster />} />
//                                     <Route path="/masters/shipment-terms-master" element={<ShipmentTermMaster />} />
//                                     <Route path="/masters/payment-terms-master" element={<PaymentTermsMaster />} />
//                                     <Route path="/masters/currency-master" element={<CurrencyMaster />} />
//                                     <Route path="/masters/consignee" element={<ConsigneeMaster />} />
//                                     <Route path="/masters/uom-master" element={<UomMaster />} />
//                                     <Route path="/masters/gst-master" element={<GstMaster />} />
//                                     <Route path="/masters/finishFabric-master" element={<FinishFabricMaster />} />
//                                     <Route path="/masters/location-management" element={<LocationManagement />} />
//                                     <Route path="/masters/fabric-management" element={<FabricManagement />} />
//                                     <Route path="/masters/flange-master" element={<FlangeMaster />} />
//                                     <Route path="/masters/warehouse" element={<WarehouseMaster />} />
//                                     <Route path="/masters/customer-management" element={<CustomerManagement />} />

//                                     <Route path="/transaction/sales-order-details" element={<SalesOrderDetails />} />
//                                     <Route path="/transaction/sales-order-export-details" element={<SalesOrderExportDetails />} />
//                                     <Route path="/transaction/sales-order" element={<SalesOrderEntry />} />
//                                     <Route path="/transaction/purchase-order" element={<PurchaseOrderEntry />} />
//                                     <Route path="/transaction/purchase-order-details" element={<PurchaseOrderDetails />} />
//                                     <Route path="/transaction/purchase-inward" element={<PurchaseInward />} />
//                                     <Route path="/transaction/purchase-inward-details" element={<PurchaseInwardDetails />} />
//                                     <Route path="/transaction/lot-details" element={<LotDetails />} />
//                                     <Route path="/transaction/weaving-contract-entry" element={<WeavingContractEntry />} />
//                                     <Route path="/transaction/weaving-contract-details" element={<WeavingContractDetails />} />
//                                     <Route path="/transaction/weaving-yarn-issue" element={<WeavingYarnIssue />} />
//                                     <Route path="/transaction/jobwork-fabric-receive" element={<JobworkFabricReceive />} />
//                                     <Route path="/transaction/fabric-inspection-details" element={<FabricInspectionDetails />} />
//                                     <Route path="/transaction/fabric-inspection" element={<FabricInspection />} />
//                                     <Route path="/transaction/piece-details" element={<PieceDetails />} />
//                                     <Route path="/transaction/invoice" element={<GenerateInvoice />} />
//                                     <Route path="/transaction/generate-packing-list-details" element={<PackingListDetails />} />
//                                     <Route path="/transaction/generate-packing-list" element={<PackingList />} />
//                                     <Route path="/transaction/process-contract-details" element={<ProcessContractDetails />} />
//                                     <Route path="/transaction/process-contract-entry" element={<ProcessContractEntry />} />
//                                     <Route path="/transaction/processing-issue" element={<ProcessingIssue />} />
//                                     <Route path="/transaction/processing-receive" element={<ProcessingReceive />} />
//                                     <Route path="/transaction/sales-order-management" element={<SalesOrderManagement />} />
//                                     <Route path="/transaction/empty-beam-issue" element={<EmptyBeamIssue />} />
//                                     <Route path="/transaction/sizing-plan-entry" element={<SizingPlanEntry />} />
//                                     <Route path="/transaction/sizing-plan-details" element={<SizingPlanDetails />} />
//                                     <Route path="/transaction/sizing-yarn-issue" element={<SizingYarnIssue />} />
//                                     <Route path="/transaction/sizing-management" element={<SizingManagement />} />
//                                     <Route path="/transaction/empty-beam-issue-details" element={<EmptyBeamIssueDetails />} />
//                                     <Route path="/transaction/sizing-yarn-issue-details" element={<SizingYarnIssueDetails />} />
//                                     <Route path="/transaction/beam-management" element={<BeamManagement />} />
//                                     <Route path="/transaction/beam-inward-entry" element={<BeamInwardEntry />} />
//                                     <Route path="/transaction/beam-inward-details" element={<BeamInwardDetails />} />
//                                     <Route path="/transaction/weaving-issue-details" element={<WeavingIssueDetails />} />
//                                     <Route path="/transaction/jobwork-fabric-receive-details" element={<JobworkFabricReceiveDetails />} />
//                                     <Route path="/transaction/processing-issue-details" element={<ProcessingIssueDetails />} />

//                                     <Route path="settings" element={<Settings />} />
//                                     <Route path="*" element={<Navigate to="/" replace />} />
//                                 </Route>
//                             </Routes>
//                         </BrowserRouter>
//                         <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default RoutesConfig;




import { Layout } from '@/components/layout/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { Settings } from 'lucide-react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
// Masters
import { CategoryMaster } from '@/pages/masters/category';
import { ConsigneeMaster } from '@/pages/masters/consignee';
import { CustomerMaster } from '@/pages/masters/customer';
import { FabricCategoryMaster } from '@/pages/masters/fabric-category';
import { FinishFabricMaster } from '@/pages/masters/finishFabric-master';
import { SubCategoryMaster } from '@/pages/masters/sub-category';
import { UomMaster } from '@/pages/masters/uom-master';
import { VendorMaster } from '@/pages/masters/vendor';
import { YarnMaster } from '@/pages/masters/yarn-master';
import { FabricTypeMaster } from '@/pages/masters/fabric-type';
import WovenFabricMaster from '@/pages/masters/fabric-master';
import { GstMaster } from '@/pages/masters/gst-master';
import KnittedFabricMaster from '@/pages/masters/knitted-fabric-master';
import { FlangeMaster } from '@/pages/masters/flange-master';
import { WarehouseMaster } from '@/pages/masters/warehouse-master';
import CustomerManagement from '@/pages/masters/customer-management';
import LocationManagement from '@/pages/masters/location-management';
import FabricManagement from '@/pages/masters/fabric-management';
import SalesOrderManagement from '@/pages/transaction/sales-order-management';
// Location Masters
import { CityMaster } from '@/pages/location-masters/city-master';
import { CountryMaster } from '@/pages/location-masters/country-master';
import { StateMaster } from '@/pages/location-masters/state-master';
// Trade Shipping Masters
import { ShipmentModeMaster } from '@/pages/trade-shipping-master/shipment-mode-master';
import { ShipmentTermMaster } from '@/pages/trade-shipping-master/shipment-terms-master';
import { CurrencyMaster } from '@/pages/trade-shipping-master/currency-master';
import { PaymentTermsMaster } from '@/pages/trade-shipping-master/payment-terms-master';
// Transactions
import { FabricInspection } from '@/pages/transaction/fabric-inspection';
import { FabricInspectionDetails } from '@/pages/transaction/fabric-inspection-dtails';
import PackingList from '@/pages/transaction/generate-packing-list';
import { PackingListDetails } from '@/pages/transaction/generate-packing-list-details';
import GenerateInvoice from '@/pages/transaction/invoice';
import JobworkFabricReceive from '@/pages/transaction/jobwork-fabric-receive';
import LotDetails from '@/pages/transaction/lot-details';
import PieceDetails from '@/pages/transaction/piece-details';
import { ProcessContractDetails } from '@/pages/transaction/process-contract-details';
import { ProcessContractEntry } from '@/pages/transaction/process-contract-entry';
import { ProcessingIssue } from '@/pages/transaction/processing-issue';
import PurchaseInward from '@/pages/transaction/purchase-inward';
import { PurchaseInwardDetails } from '@/pages/transaction/purchase-inward-details';
import { PurchaseOrderEntry } from '@/pages/transaction/purchase-order';
import { PurchaseOrderDetails } from '@/pages/transaction/purchase-order-details';
import SalesOrderEntry from '@/pages/transaction/sales-order';
import { SalesOrderDetails } from '@/pages/transaction/sales-order-details';
import { WeavingContractDetails } from '@/pages/transaction/weaving-contract-details';
import { WeavingContractEntry } from '@/pages/transaction/weaving-contract-entry';
import { WeavingYarnIssue } from '@/pages/transaction/weaving-yarn-issue';
import { SalesOrderExportDetails } from '@/pages/transaction/sales-order-export-details';
import EmptyBeamIssue from '@/pages/transaction/empty-beam-issue';
import { SizingPlanDetails } from '@/pages/transaction/sizing-plan-details';
import { SizingYarnIssue } from '@/pages/transaction/sizing-yarn-issue';
import SizingManagement from '@/pages/transaction/sizing-management';
import { EmptyBeamIssueDetails } from '@/pages/transaction/empty-beam-issue-details';
import BeamManagement from '@/pages/transaction/beam-management';
import SizingPlanEntry from '@/pages/transaction/sizing-plan-entry';
import BeamInwardEntry from '@/pages/transaction/beam-inward-entry';
import { SizingYarnIssueDetails } from '@/pages/transaction/sizing-yarn-issue-details';
import { BeamInwardDetails } from '@/pages/transaction/beam-inward-details';
import { WeavingIssueDetails } from '@/pages/transaction/weaving-issue-details';
import { JobworkFabricReceiveDetails } from '@/pages/transaction/jobwork-fabric-details';
import { ProcessingIssueDetails } from '@/pages/transaction/processing-issue-details';
import PackingListManagement from '@/pages/transaction/packing-list-management';
import { InvoiceDetails } from '@/pages/transaction/invoice-details';
import { FinishFabricReceiveDetails } from '@/pages/transaction/finish-fabric-receive-details';
import { ProcessingReceive } from '@/pages/transaction/processing-receive';
import { GradeMaster } from '@/pages/masters/grade-master';
import { DefectMaster } from '@/pages/masters/defect-master';
import ProcessContactManagement from '@/pages/transaction/process-contact-management';
import ProcessingIssueManagement from '@/pages/transaction/processing-issue-management';
import ProcessingReceiveManagement from '@/pages/transaction/process-receive-management';
import InvoiceManagement from '@/pages/transaction/invoice-management';
import { ProcessContractYarnEntry } from '@/pages/transaction/process-contract-yarn-entry';
import Login from '@/pages/login';
import { ProcessMaster } from '@/pages/masters/process-master';

const RoutesConfig: React.FC = () => {
    return (
        <div className="flex h-screen">
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-auto">
                    <div className=''>
                        <Routes>
                            <Route path="/" element={<Layout />}>
                                <Route index element={<Dashboard />} />
                                <Route path="login" element={<Login />} />
                                {/* Masters Routes */}
                                <Route path="masters">
                                    <Route path="category" element={<CategoryMaster />} />
                                    <Route path="sub-category" element={<SubCategoryMaster />} />
                                    <Route path="yarn-master" element={<YarnMaster />} />
                                    <Route path="woven-fabric-master" element={<WovenFabricMaster />} />
                                    <Route path="knitted-fabric-master" element={<KnittedFabricMaster />} />
                                    <Route path="fabric-type" element={<FabricTypeMaster />} />
                                    <Route path="fabric-category" element={<FabricCategoryMaster />} />
                                    <Route path="customer" element={<CustomerMaster />} />
                                    <Route path="vendor" element={<VendorMaster />} />
                                    <Route path="consignee" element={<ConsigneeMaster />} />
                                    <Route path="uom-master" element={<UomMaster />} />
                                    <Route path="gst-master" element={<GstMaster />} />
                                    <Route path="finishFabric-master" element={<FinishFabricMaster />} />
                                    <Route path="flange-master" element={<FlangeMaster />} />
                                    <Route path="warehouse" element={<WarehouseMaster />} />
                                    <Route path="customer-management" element={<CustomerManagement />} />
                                    <Route path="location-management" element={<LocationManagement />} />
                                    <Route path="fabric-management" element={<FabricManagement />} />
                                    <Route path="shipment-mode-master" element={<ShipmentModeMaster />} />
                                    <Route path="shipment-terms-master" element={<ShipmentTermMaster />} />
                                    <Route path="payment-terms-master" element={<PaymentTermsMaster />} />
                                    <Route path="currency-master" element={<CurrencyMaster />} />
                                    <Route path="grade-master" element={<GradeMaster />} />
                                    <Route path="defect-master" element={<DefectMaster />} />
                                    <Route path="process-master" element={<ProcessMaster />} />
                                </Route>

                                {/* Location Masters */}
                                <Route path="location-masters">
                                    <Route path="country-master" element={<CountryMaster />} />
                                    <Route path="state-master" element={<StateMaster />} />
                                    <Route path="city-master" element={<CityMaster />} />
                                </Route>

                                {/* Trade Shipping Masters */}
                                {/* <Route path="trade-shipping-master">
                                    <Route path="shipment-mode-master" element={<ShipmentModeMaster />} />
                                    <Route path="shipment-terms-master" element={<ShipmentTermMaster />} />
                                    <Route path="payment-terms-master" element={<PaymentTermsMaster />} />
                                    <Route path="currency-master" element={<CurrencyMaster />} />
                                </Route> */}

                                {/* Transaction Routes */}
                                <Route path="transaction">
                                    <Route path="sales-order-management" element={<SalesOrderManagement />} />
                                    <Route path="sales-order" element={<SalesOrderEntry />} />
                                    <Route path="sales-order-details" element={<SalesOrderDetails />} />
                                    <Route path="sales-order-export-details" element={<SalesOrderExportDetails />} />
                                    <Route path="purchase-order" element={<PurchaseOrderEntry />} />
                                    <Route path="purchase-order-details" element={<PurchaseOrderDetails />} />
                                    <Route path="purchase-inward" element={<PurchaseInward />} />
                                    <Route path="purchase-inward-details" element={<PurchaseInwardDetails />} />
                                    <Route path="lot-details" element={<LotDetails />} />
                                    <Route path="weaving-contract-entry" element={<WeavingContractEntry />} />
                                    <Route path="weaving-contract-details" element={<WeavingContractDetails />} />
                                    <Route path="weaving-yarn-issue" element={<WeavingYarnIssue />} />
                                    <Route path="jobwork-fabric-receive" element={<JobworkFabricReceive />} />
                                    <Route path="fabric-inspection" element={<FabricInspection />} />
                                    <Route path="fabric-inspection-details" element={<FabricInspectionDetails />} />
                                    <Route path="piece-details" element={<PieceDetails />} />
                                    <Route path="invoice" element={<GenerateInvoice />} />
                                    <Route path="generate-packing-list" element={<PackingList />} />
                                    <Route path="generate-packing-list-details" element={<PackingListDetails />} />
                                    <Route path="process-contract-entry" element={<ProcessContractEntry />} />
                                    <Route path="process-contract-yarn-entry" element={<ProcessContractYarnEntry />} />
                                    <Route path="process-contract-details" element={<ProcessContractDetails />} />
                                    <Route path="processing-issue" element={<ProcessingIssue />} />
                                    <Route path="processing-receive" element={<ProcessingReceive />} />
                                    <Route path="empty-beam-issue" element={<EmptyBeamIssue />} />
                                    <Route path="sizing-plan-entry" element={<SizingPlanEntry />} />
                                    <Route path="sizing-plan-details" element={<SizingPlanDetails />} />
                                    <Route path="sizing-yarn-issue" element={<SizingYarnIssue />} />
                                    <Route path="sizing-management" element={<SizingManagement />} />
                                    <Route path="empty-beam-issue-details" element={<EmptyBeamIssueDetails />} />
                                    <Route path="sizing-yarn-issue-details" element={<SizingYarnIssueDetails />} />
                                    <Route path="beam-management" element={<BeamManagement />} />
                                    <Route path="beam-inward-entry" element={<BeamInwardEntry />} />
                                    <Route path="beam-inward-details" element={<BeamInwardDetails />} />
                                    <Route path="weaving-issue-details" element={<WeavingIssueDetails />} />
                                    <Route path="jobwork-fabric-receive-details" element={<JobworkFabricReceiveDetails />} />
                                    <Route path="processing-issue-details" element={<ProcessingIssueDetails />} />
                                    <Route path="packing-list-mamagement" element={<PackingListManagement />} />
                                    <Route path="invoice-details" element={<InvoiceDetails />} />
                                    <Route path="finish-fabric-receive-details" element={<FinishFabricReceiveDetails />} />
                                    <Route path="process-contract-managemant" element={<ProcessContactManagement />} />
                                    <Route path="processing-issue-management" element={<ProcessingIssueManagement />} />
                                    <Route path="processing-receive-management" element={<ProcessingReceiveManagement />} />
                                    <Route path="invoice-management" element={<InvoiceManagement />} />
                                </Route>

                                <Route path="settings" element={<Settings />} />
                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Route>
                        </Routes>
                        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoutesConfig;