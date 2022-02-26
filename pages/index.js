import React, { useEffect, useState, useCallback } from "react";
import download from "downloadjs";
import {
  Badge,
  Banner,
  Button,
  ButtonGroup,
  Card,
  ChoiceList,
  Collapsible,
  DataTable,
  DisplayText,
  Form,
  FormLayout,
  Heading,
  Layout,
  Link,
  List,
  MediaCard,
  Modal,
  Page,
  PageActions,
  Stack,
  Subheading,
  TextContainer,
  TextField,
  VideoThumbnail,
} from "@shopify/polaris";
import axios from "axios";
import ReactPlayer from "react-player/lazy";
import PlanModal from "./planmodal"
// import BillingWOFree from "./billingwofree";
// import BillingWithFree from "./billingwithfree"
import { render } from "react-dom";

const Index = () => {
  const nonceCreate = require("nonce")();
  let nonce = nonceCreate();

  // customer details
  const [serialNum, setSerialNum] = useState({});
  const [serial, setSerial] = useState("");
  const [isPrime, setIsPrime] = useState(false);
  const [userAccessToken, setUserAccessToken] = useState("");
  const [edMode, setEdMode] = useState(false);

  // plan details
  const [listOfPlans, setListOfPlans] = useState([]);
  const [isPlanActive, setIsPlanActive] = useState(false);
  const [planNearExp, setPlanNearExp] = useState(false);
  const [isFreePlan, setIsFreePlan] = useState(false);
  const [isMonthlyPlan, setIsMonthlyPlan] = useState(false);
  const [isOrderPlan, setIsOrderPlan] = useState(false);
  const [productLimit, setProductLimit] = useState(0);
  const [imageLimit, setImageLimit] = useState(0);
  const [orderRecLimit, setOrderRecLimit] = useState(0);
  const [planExpiry, setPlanExpiry] = useState()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [process, setProcess] = useState([]);
  const [monthly, setMonthly] = useState(false);
  const [yearly, setYearly] = useState(false);
  const [planChangeDate, setPlanChangeDate] = useState();
  const [planExpiryDate, setPlanExpiryDate] = useState();

  // process details
  const [result, setResult] = useState([]);
  const [orderRec, setOrderRec] = useState(0);
  const [orderDel, setOrderDel] = useState(0);
  const [orderRet, setOrderRet] = useState(0);
  const [product, setProduct] = useState(0);
  const [image, setImage] = useState(0);

  // miscellenous 
  const [showPlans, setShowPlans] = useState(true);
  const [changeOfPlans, setChangeOfPlans] = useState(true);
  const [open, setOpen] = useState(false);
  const [featureOpen, setFeatureOpen] = useState(
    serialNum === null ? true : false
  );
  const [installedDays, setInstalledDays] = useState("");
  const [isFPAOnce, setIsFPAOnce] = useState(false);
  const [icCharged, setIcCharged] = useState(false);
  const [isPlanChanged, setIsPlanChanged] = useState(false);

  let url1 = `https://www.youtube.com/embed/xKC_wnO1fFc?showinfo=0&enablejsapi=1&origin=${window.location.origin}`;
  let url2 = `https://www.youtube.com/embed/3LZ-i-JOmZE?showinfo=0&enablejsapi=1&origin=${window.location.origin}`;
  let url3 = `https://www.youtube.com/embed/P7q_7k8t3-I?showinfo=0&enablejsapi=1&origin=${window.location.origin}`;
  let url4 = `https://www.youtube.com/embed/uZ-DQhNqlzc?showinfo=0&enablejsapi=1&origin=${window.location.origin}`;

  Date.isLeapYear = function (year) {
    return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
  };

  Date.getDaysInMonth = function (year, month) {
    return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
  };

  Date.prototype.isLeapYear = function () {
    return Date.isLeapYear(this.getFullYear());
  };

  Date.prototype.getDaysInMonth = function () {
    return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
  };

  Date.prototype.addMonths = function (value) {
    var n = this.getDate();
    this.setDate(1);
    this.setMonth(this.getMonth() + value);
    this.setDate(Math.min(n, this.getDaysInMonth()));
    return this;
  };

  function datediff(date1, date2, interval) {
    var second = 1000, minute = second * 60, hour = minute * 60, day = hour * 24, week = day * 7;
    date1 = new Date(date1);
    date2 = new Date(date2);
    var timediff = date2 - date1;
    if (isNaN(timediff)) return NaN;
    switch (interval) {
      case "years": return date2.getFullYear() - date1.getFullYear();
      case "months": return (
        (date2.getFullYear() * 12 + date2.getMonth())
        -
        (date1.getFullYear() * 12 + date1.getMonth())
      );
      case "weeks": return Math.floor(timediff / week);
      case "days": return Math.floor(timediff / day);
      case "hours": return Math.floor(timediff / hour);
      case "minutes": return Math.floor(timediff / minute);
      case "seconds": return Math.floor(timediff / second);
      default: return undefined;
    }
  }

  // console.log(isPlanActive, planNearExp, isFreePlan, isFPAOnce, isOrderPlan, isMonthlyPlan, orderRecLimit, productLimit, imageLimit, icCharged)
  const postPlanDetailtoDB = (isPlanActive, planNearExp, isFreePlan, isFPAOnce, isOrderPlan, isMonthlyPlan, orderRecLimit, productLimit, imageLimit, icCharged, planChangeDate, planExpiryDate) => {
    // console.log("Plan About to be updated :: ", { shop: shop, serialNumber: serial, tallyPrime: isPrime, isPlanActive: isPlanActive, planNearExp: planNearExp, isFreePlan: isFreePlan, isFPAOnce: isFPAOnce, isOrderPlan: isOrderPlan, isMonthlyPlan: isMonthlyPlan, orderRecLimit: orderRecLimit, productLimit: productLimit, imageLimit: imageLimit, icCharged: icCharged, planChangeDate: planChangeDate, planExpiryDate: planExpiryDate })
    try {
      axios
        .post("/api/regform", {
          shop: shop,
          serialNumber: serial,
          tallyPrime: isPrime,
          isPlanActive: isPlanActive,
          planNearExp: planNearExp,
          isFreePlan: isFreePlan,
          isFPAOnce: isFPAOnce,
          isOrderPlan: isOrderPlan,
          isMonthlyPlan: isMonthlyPlan,
          orderRecLimit: orderRecLimit,
          productLimit: productLimit,
          imageLimit: imageLimit,
          icCharged: icCharged,
          planChangeDate: planChangeDate,
          planExpiryDate: planExpiryDate
        })
        .catch((err) => {
          console.log("err: ", err);
        });
    } catch (e) {
      console.log("e ::", e);
    }
    // getData()
  }

  if (isPlanChanged) {
    try {
      postPlanDetailtoDB(isPlanActive, planNearExp, isFreePlan, isFPAOnce, isOrderPlan, isMonthlyPlan, orderRecLimit, productLimit, imageLimit, icCharged, planChangeDate, planExpiryDate);
      setIsPlanChanged(false);
    } catch (error) {
      console.log("Error :: ", error);
    }
  }
  const handlePlanChange = (planChange, monthly, yearly) => {
    // console.log('Plan Start :: ', planChangeDate);
    // console.log("trying to change the plan, fingers crossed :: ", planChange)
    // console.log("planToChange :: ", planChange, " Monthly :: ", monthly, " Yearly :: ", yearly, " title :: ", planChange.title);
    // console.log("Serial :: ", serialNum)
    // console.log("Plan about to be changed to :: ", planChange.title, planChange.title == "Free")
    setIsPlanChanged(true);
    var now = new Date();
    const one_day = 1000 * 60 * 60 * 24
    if (planChange.title == "Order Based Plan") {
      setPlanChangeDate(new Date());
      var expiry = new Date(now.setFullYear(now.getFullYear() + 1));
      var date1 = new Date();
      var date2 = new Date(expiry);
      // console.log(date2);
      const diffTime = Math.abs(date2 - date1);
      const diffDays = Math.ceil(diffTime / one_day);
      // console.log("Difference in MilliSeconds :: ", diffTime);
      // console.log('Difference in Days', diffDays);
      // console.log("Plan is about to get over :: ", diffDays < 11)
      setPlanExpiry(diffDays);
      if (diffDays < 11) {
        setPlanNearExp(true)
        setShowPlans(true);
      } else {
        setPlanNearExp(false);
        setShowPlans(false);
      }
      setPlanExpiryDate(expiry)
      if (!isPlanActive) setIsPlanActive(!isPlanActive);
      setIsFreePlan(false);
      setIcCharged(true)
      setIsOrderPlan(true);
      setSerialNum(serial);
      setIsMonthlyPlan(false);
      setOrderRecLimit(orderRecLimit + planChange.numOrders);
      setProductLimit(productLimit + planChange.numProducts);
      setImageLimit(imageLimit + planChange.numImages);
      setPlanNearExp(false);
      setIsFPAOnce(true);
      setShowPlans(true);
    } else if (planChange.title == "Orders Add-On" || planChange.title == "Products Add-On") {
      // var expiry = new Date(now.setFullYear(now.getFullYear() + 1));
      // console.log(planChangeDate, planExpiryDate)
      setPlanChangeDate(planChangeDate)
      setPlanExpiryDate(planExpiryDate)
      // var expiry = new Date(now.setFullYear(now.getFullYear() + 1));
      var date1 = new Date();
      var date2 = new Date(planExpiryDate);
      // console.log(date2);
      const diffTime = Math.abs(date2 - date1);
      const diffDays = Math.ceil(diffTime / one_day);
      // console.log("Difference in MilliSeconds :: ", diffTime);
      // console.log('Difference in Days', diffDays);
      // console.log("Plan is about to get over :: ", diffDays < 11)
      setPlanExpiry(diffDays);
      if (diffDays < 11) {
        setPlanNearExp(true)
        setShowPlans(true);
      } else {
        setPlanNearExp(false);
        setShowPlans(false);
      }
      if (!isPlanActive) setIsPlanActive(!isPlanActive);
      setIsFreePlan(false);
      setIcCharged(true)
      setIsOrderPlan(true);
      setSerialNum(serial);
      setIsMonthlyPlan(false);
      setOrderRecLimit(orderRecLimit + planChange.numOrders);
      setProductLimit(productLimit + planChange.numProducts);
      setImageLimit(imageLimit + planChange.numImages);
      setPlanNearExp(false);
      setIsFPAOnce(true);
      setShowPlans(true);
    } else if (planChange.title == "Free") {
      setPlanChangeDate(new Date());
      var expiry = new Date().addMonths(1);
      var date1 = new Date();
      var date2 = new Date(expiry);
      // console.log(date2);
      const diffTime = Math.abs(date2 - date1);
      const diffDays = Math.ceil(diffTime / one_day);
      // console.log("Difference in MilliSeconds :: ", diffTime);
      // console.log('Difference in Days', diffDays);
      // console.log("Plan is about to get over :: ", diffDays < 11)
      setPlanExpiry(diffDays);
      if (diffDays < 11) {
        setPlanNearExp(true)
        setShowPlans(true);
      } else {
        setPlanNearExp(false);
        setShowPlans(false);
      }
      setPlanExpiryDate(new Date().addMonths(1))
      // console.log('Expiry :: ', expiry);
      // console.log(planChange.numOrders, planChange.numProducts, planChange.numImages);
      if (!isPlanActive) setIsPlanActive(!isPlanActive);
      setPlanNearExp(true);
      setIsFreePlan(true);
      setIsOrderPlan(false);
      setIsMonthlyPlan(false);
      setIsFPAOnce(true);
      setIcCharged(false)
      setOrderRecLimit(planChange.numOrders);
      setProductLimit(planChange.numProducts);
      setImageLimit(planChange.numImages);
      setSerialNum(serial);
      // console.log("Plan Changed to Non-Free for next round ::", isFreePlan);
    } else if (planChange.title == "Periodic Plan") {
      setPlanChangeDate(new Date());
      if (yearly) {
        var expiry = new Date(now.setFullYear(now.getFullYear() + 1));
        setPlanExpiryDate(expiry)
        // console.log('Expiry :: ', expiry);
        var date1 = new Date();
        var date2 = new Date(expiry);
        // console.log(date2);
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / one_day);
        // console.log("Difference in MilliSeconds :: ", diffTime);
        // console.log('Difference in Days', diffDays);
        // console.log("Plan is about to get over :: ", diffDays < 11)
        setPlanExpiry(diffDays);
        if (diffDays < 11) {
          setPlanNearExp(true)
          setShowPlans(true);
        } else {
          setPlanNearExp(false);
          setShowPlans(false);
        }
      }
      if (monthly) {
        var expiry = new Date().addMonths(1);
        setPlanExpiryDate(new Date().addMonths(1))
        // console.log('Expiry :: ', planExpiryDate);
        var date1 = new Date();
        var date2 = new Date(planExpiryDate);
        // console.log(date2);
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / one_day);
        // console.log("Difference in MilliSeconds :: ", diffTime);
        // console.log('Difference in Days', diffDays);
        // console.log("Plan is about to get over :: ", diffDays < 11)
        setPlanExpiry(diffDays);
        if (diffDays < 11) {
          setPlanNearExp(true)
          setShowPlans(true);
        } else {
          setPlanNearExp(false);
          setShowPlans(false);
        }
      }
      setOrderRecLimit(null);
      setProductLimit(null);
      setImageLimit(null);
      setIsMonthlyPlan(true);
      if (isFreePlan) setIsFreePlan(!isFreePlan);
      if (isOrderPlan) setIsOrderPlan(!isOrderPlan);
    }
    if (!isPlanActive) setIsPlanActive(!isPlanActive);
    setSerialNum(serial);
  }

  function PlanCard(props) {
    const {
      objID,
      keyID,
      planId,
      isSelected,
      installationCharge,
      title,
      monthlyPrice,
      annualPriceA,
      annualPriceB,
      orderPrice,
      productPrice,
      imagePrice,
      numOrders,
      numProducts,
      numImages,
    } = props;
    const planDetail = props
    // const [isActive, setStatus] = React.useState(false);
    // console.log("checking plan detail :: ", planDetail);

    return (
      <>
        <Layout.Section key={keyID} secondary >
          {planId == 1 ? <Heading element='h1'>Kindly Select an Plan</Heading> : null}
          {planId == 2 && (isFreePlan || isOrderPlan || isMonthlyPlan) ? <Heading element='h1'>Kindly Select an Plan</Heading> : null}
          {planId == 2 && !isFreePlan && !isOrderPlan && !isMonthlyPlan ? <Heading element='h1'>.</Heading> : null}
          {/* {planId == 2 ? <Heading element='h1'>.</Heading> : null} */}
          {planId == 3 ? <Heading element='h1'>.</Heading> : null}
          {planId == 4 ? <Heading element='h1'>Add-On Plans</Heading> : null}
          {planId == 5 ? <Heading element='h1'>.</Heading> : null}
          {/* </Layout.Section> */}
          {/* <Layout.Section> */}
          <Card>
            {monthlyPrice == 0
              ? <>
                <Card.Section style={{ height: 160 }} title={title == 'Free' ? 'Free - Available only One Time' : title} >
                  <Stack>
                    <Stack.Item fill>
                      {productPrice !== 0 ? <DisplayText size="medium">${productPrice}/{numProducts} Products</DisplayText> : null}
                      {orderPrice !== 0 ? <DisplayText size="medium">${orderPrice}/{numOrders} Orders</DisplayText> : null}
                      {imagePrice !== 0 ? <DisplayText size="medium">${imagePrice}/{numImages} Images</DisplayText> : null}
                      {title == 'Free' ? <DisplayText size="medium">${orderPrice}/{numOrders} Orders</DisplayText> : null}
                    </Stack.Item>
                    <Stack.Item>{null}
                    </Stack.Item>
                  </Stack>
                  <Stack>
                    <Stack.Item fill>Add Number of Orders</Stack.Item>
                    <Stack.Item>{numOrders}</Stack.Item>
                  </Stack>
                  <Stack>
                    <Stack.Item fill>Add Number of Products</Stack.Item>
                    <Stack.Item>{numProducts}</Stack.Item>
                  </Stack>
                  <Stack>
                    <Stack.Item fill>Add Number of Images</Stack.Item>
                    <Stack.Item>{numImages}</Stack.Item>
                  </Stack>
                  {!icCharged
                    ?
                    <>
                      <Stack>
                        <Stack.Item fill>Installation Charge</Stack.Item>
                        <Stack.Item>${installationCharge.toFixed(2)}</Stack.Item>
                      </Stack>
                      <Stack>
                        <Stack.Item fill><a>(Applicable One-Time)</a></Stack.Item>
                      </Stack>
                    </>
                    : null
                  }
                  {title == 'Free' ? <Stack><Stack.Item fill>Period</Stack.Item><Stack.Item>30 Days</Stack.Item></Stack> : <Stack><Stack.Item fill>Period :</Stack.Item><Stack.Item>1 Year</Stack.Item></Stack>}
                </Card.Section>
              </>
              : <>
                <Card.Section style={{ height: 160 }} title={title == 'Free' ? 'Free - Available only One Time' : title} >
                  <Stack>
                    <Stack.Item fill>
                      <DisplayText size="medium">
                        ${monthlyPrice}/30 Days
                      </DisplayText>
                    </Stack.Item>
                    <Stack.Item>
                      ${annualPriceB} / 365 Days
                    </Stack.Item>
                  </Stack>
                  <Stack>
                    <Stack.Item fill>Number of Orders</Stack.Item>
                    <Stack.Item>Unlimited</Stack.Item>
                  </Stack>
                  <Stack>
                    <Stack.Item fill>Number of Products</Stack.Item>
                    <Stack.Item>Unlimited</Stack.Item>
                  </Stack>
                  <Stack>
                    <Stack.Item fill>Number of Images</Stack.Item>
                    <Stack.Item>Unlimited</Stack.Item>
                  </Stack>
                  <Stack>
                    <Stack.Item fill>Period :</Stack.Item>
                    <Stack.Item>Monthly / Annually</Stack.Item>
                  </Stack>
                  {!icCharged
                    ? <>
                      <Stack>
                        <Stack.Item fill>Installation Charge (Applicable One-Time)</Stack.Item>
                        <Stack.Item>${installationCharge.toFixed(2)}</Stack.Item>
                      </Stack>
                    </>
                    : null
                  }
                </Card.Section>
              </>
            }
            <Card.Section>
              <PlanModal planDetail={planDetail} handlePlanChange={handlePlanChange} icCharged={icCharged} />
            </Card.Section>
          </Card>
        </Layout.Section>
      </>
    )
  }

  async function getData() {
    const one_day = 1000 * 60 * 60 * 24
    // console.log('setting process data')
    try {
      const res = await axios.get("/api/shop?shop=" + shop);
      if (res) {
        // console.log(res.data.data);
        // console.log("limit on Orders :: ", res.data.data.isPlanActive);
        setIsPlanActive(res.data.data.isPlanActive);
        setIsFreePlan(res.data.data.isFreePlan);
        setIsOrderPlan(res.data.data.isOrderPlan);
        setIsMonthlyPlan(res.data.data.isMonthlyPlan);
        setImageLimit(res.data.data.imageLimit);
        setProductLimit(res.data.data.productLimit);
        setOrderRecLimit(res.data.data.orderRecLimit);
        setIsFPAOnce(res.data.data.isFPAOnce);
        setIcCharged(res.data.data.icCharged);
        setPlanChangeDate(res.data.data.planChangeDate);
        setPlanExpiryDate(res.data.data.planExpiryDate);
        // console.log("Is free plan active :: ", res.data.data.isFreePlan)
        // var instOn = new Date(res.data.data.planChangeDate);
        var date1 = new Date();
        var date2 = new Date(res.data.data.planExpiryDate);
        // console.log(date2);
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / one_day);
        // console.log("Difference in MilliSeconds :: ", diffTime);
        // console.log('Difference in Days', diffDays);
        // console.log("Plan is about to get over :: ", diffDays < 11)
        setPlanExpiry(diffDays);
        if (diffDays < 11) {
          setPlanNearExp(true)
          setShowPlans(true);
        } else {
          setPlanNearExp(false);
          setShowPlans(false);
        }
        var dateDif = datediff(planChangeDate, new Date(), 'days')
        if (dateDif < 31) {
          dateDif = datediff(planChangeDate, new Date(), 'days');
          setInstalledDays(dateDif, " Days");
        }
        if (dateDif >= 31 && dateDif < 365) {
          dateDif = datediff(planChangeDate, new Date(), 'months');
          setInstalledDays(dateDif, " Months");
        }
        if (dateDif > 365) {
          dateDif = datediff(planChangeDate, new Date(), 'years');
          setInstalledDays(dateDif, " Years");
        }
        setSerial(res.data.data.serial);
        setIsPrime(res.data.data.isPrime);
        setUserAccessToken(res.data.data.accessToken);
        if (isPlanActive) {
          setProcess(res.data.data.process);
          let array = res.data.data.process
          {
            array[0] != null ? array = res.data.data.process.map(
              ({ date, type, processid, status, url, systemName, ip }) => {
                return [date, type, processid, status, url, systemName, ip];
              }
            )
              : array = [];
          }
          setResult(array);
          setOrderRec(
            res.data.data.process.filter(function (e) {
              return e.type == "order" && e.status == "received";
            }).length
          );
          setOrderDel(
            res.data.data.process.filter(function (e) {
              return e.type == "order" && e.status == "delivered";
            }).length
          );
          setOrderRet(
            res.data.data.process.filter(function (e) {
              return e.type == "order" && e.status == "returned";
            }).length
          );
          setProduct(
            res.data.data.process.filter(function (e) {
              return e.type == "product";
            }).length
          );
          setImage(
            res.data.data.process.filter(function (e) {
              return e.type == "image";
            }).length
          );
        }
        // setOrderRec(5)
      }
    } catch (e) {
      setSerial(null);
      setProcess([]);
      setResult([]);
      console.log("ee : ", e);
    }
  }

  function checkPlanValidity() {
    if (isMonthlyPlan) {
      var date1 = new Date();
      var date2 = new Date(planExpiryDate);
      const diffTime = Math.abs(date2 - date1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      console.log(diffTime + " milliseconds");
      console.log(diffDays + " days");
      setPlanExpiry(diffDays);
      // console.log("Plan is about to get over :: ", diffDays < 11)
      if (diffDays < 11) {
        setPlanNearExp(true)
        setShowPlans(true);
      } else {
        setPlanNearExp(false);
        setShowPlans(false);
      }
    }

  }

  async function getPlans() {
    try {
      const res = await axios.get("/api/plans?shop=" + shop);
      let planDetail = res.data.data.planDetail
      setListOfPlans(planDetail);
      // if (res) console.log(res.data.data.planDetail);

      // console.log("Plan is Active :: ", isPlanActive, "Plan Near Expiry", planNearExp)
      // if (isPlanActive) {
      //   if (planNearExp) {
      //     if (res) {
      //       let planDetail = res.data.data.planDetail;
      //       planDetail = planDetail.sort((a, b) => {
      //         return a.id - b.id;
      //       }).filter(plans => plans.name !== 'Free');
      //       setListOfPlans(planDetail);
      //       // console.log("List of Plans Filtered", planDetail);
      //     }
      //   }
      // }

      // console.log("Plan is Active :: ", isPlanActive, "Number of Orders Processed :: ", orderRec)
      // if (orderRec === 0) {
      //   if (!isPlanActive) {
      //     if (res) {
      //       let planDetail = res.data.data.planDetail;
      //       planDetail = planDetail.sort((a, b) => {
      //         return a.id - b.id;
      //       });
      //       setListOfPlans(planDetail);
      //       // console.log("setting list of plans :: ", planDetail);
      //     }
      //   }
      // }

      // console.log("Plan is Active :: ", isPlanActive, "Number of Orders Processed :: ", orderRec)
      // if (orderRec !== 0) {
      //   if (!isPlanActive) {
      //     if (res) {
      //       let planDetail = res.data.data.planDetail;
      //       for (var i = 0; i < planDetail.length; i++) {
      //         // console.log("Before Filter is Applied :: ", planDetail[i].name)
      //       }
      //       planDetail = planDetail.sort((a, b) => {
      //         return a.id - b.id;
      //       }).filter(function (e) {
      //         return e.name != "Free";
      //       })
      //       for (var i = 0; i < planDetail.length; i++) {
      //         // console.log("After Filter is Applied :: ", planDetail[i].name)
      //       }
      //       //.filter(plans => plans.name !== 'Free');
      //       setListOfPlans(planDetail);
      //       // console.log("List of Plans Filtered", planDetail);
      //     }
      //   }
      // }
      // console.log(planArray);
    } catch (e) {
      console.log("errors while fatching plans ::", e)
    }
  }

  function BillingPlans() {
    // console.log(listOfPlans)
    let data = listOfPlans.filter(function (plan) { return plan.id == 2 || plan.id == 3 })
    // console.log(data)
    return (
      <>
        <Layout>
          {data
            .map(plan => (
              <PlanCard
                objID={plan._id}
                isSelected={plan.id == 2}
                planId={plan.id}
                key={`key_${plan.id}`}
                title={plan.name}
                installationCharge={plan.installationCharge}
                orderPrice={plan.orderPrice}
                productPrice={plan.productPrice}
                imagePrice={plan.imagePrice}
                numOrders={plan.numOrders}
                numProducts={plan.numProducts}
                numImages={plan.numImages}
                monthlyPrice={plan.monthlyPrice}
                annualPriceA={(plan.annualPrice / 12).toFixed(2)}
                annualPriceB={plan.annualPrice.toString()}
              />
            ))}
        </Layout>
      </>
    )
  }

  function AddOnPlans() {

    // const plans = listOfPlans
    if (listOfPlans) return (
      <>
        <Layout>
          {listOfPlans
            .filter(function (e) { return (e.id == 4 || e.id == 5) })
            .sort((a, b) => { return a.id - b.id; })
            .map(plan => (
              <PlanCard
                objID={plan._id}
                isSelected={plan.id == 1}
                planId={plan.id}
                key={`key_${plan.id}`}
                title={plan.name}
                installationCharge={plan.installationCharge}
                orderPrice={plan.orderPrice}
                productPrice={plan.productPrice}
                imagePrice={plan.imagePrice}
                numOrders={plan.numOrders}
                numProducts={plan.numProducts}
                numImages={plan.numImages}
                monthlyPrice={plan.monthlyPrice}
                annualPriceA={(plan.annualPrice / 12).toFixed(2)}
                annualPriceB={plan.annualPrice.toString()}
              />
            ))}
        </Layout>
      </>)
  }

  function FreeBillingPlan() {

    // const plans = listOfPlans
    if (listOfPlans) return (
      <>
        <Layout>
          {listOfPlans.filter(function (plan) { return plan.id == 1 }).map(plan => (
            <PlanCard
              objID={plan._id}
              isSelected={plan.id == 1}
              planId={plan.id}
              key={`key_${plan.id}`}
              title={plan.name}
              installationCharge={plan.installationCharge}
              orderPrice={plan.orderPrice}
              productPrice={plan.productPrice}
              imagePrice={plan.imagePrice}
              numOrders={plan.numOrders}
              numProducts={plan.numProducts}
              numImages={plan.numImages}
              monthlyPrice={plan.monthlyPrice}
              annualPriceA={(plan.annualPrice / 12).toFixed(2)}
              annualPriceB={plan.annualPrice.toString()}
            />
          ))}
        </Layout>
      </>)
  }

  useEffect(() => {
    const intialSetup = async () => {
      await getData();
      await getPlans();
      checkPlanValidity();

      {
        !serial
          ? <>
            {!isPlanActive
              ? <>
                {planNearExp
                  ? setShowPlans(true)
                  : setShowPlans(false)}
              </>
              : setShowPlans(false)
            }
          </>
          : setShowPlans(false)
      }
    };
    intialSetup();
  }, []);


  const handleSerialChange = useCallback((value) => {
    setSerialNum(value);
  }, []);
  const handleToggle = useCallback(() => setOpen((open) => !open), []);
  const handleFeatToggle = useCallback(() =>
    setFeatureOpen((featureOpen) => !featureOpen, [])
  );
  const handleEdButton = useCallback(() => {
    setEdMode(!edMode);
    return;
  }, [edMode]);

  const handleShowPlans = useCallback(() => {
    setShowPlans(!showPlans);
    return
  }, [showPlans]);
  // console.log("Show Plans :: ", showPlans);

  const handleIsPrime = useCallback(() => {
    setIsPrime(!isPrime);
    return;
  }, [isPrime]);

  const validate = () => {
    let err = {};
    if (!serialNum) {
      err.title = "Serial Number is Required";
    } else if (serialNum % 9 !== 0) {
      err.title = "Invalid Serial Number";
    } else {
      err.title = "Thank you";
    }
    return err;
  };

  const handleSubmitSerial = async () => {

    let errs = validate();

    setErrors(errs);
    setIsSubmitting(true);

    if (serialNum % 9 === 0) {
      try {
        axios
          .post("/api/regForm", {
            shop: shop,
            serialNumber: serialNum,
            tallyPrime: isPrime,
            isPlanActive,
            planNearExp,
            isFreePlan,
            isOrderPlan,
            isMonthlyPlan,
            orderRecLimit: 0,
            productLimit: 0,
            imageLimit: 0,
          })
          .catch((err) => {
            console.log("err: ", err);
          });
      } catch (e) {
        console.log("e ::", e);
      }
    }
    let fileName;
    let fn;
    if (isPrime) {
      fileName = "/api/TCP?name=TPSAPI.tcp&shop=" + shop;
      fn = "TPSAPI.tcp";
    } else {
      fileName = "/api/TCP?name=TESAPI.tcp&shop=" + shop;
      fn = "TESAPI.tcp";
    }
    async function downloadFile(file) {
      axios
        .get(`${file}/download`, {
          responseType: "blob", // had to add this one here
        })
        .then((response) => {
          const content = response.headers["content-type"];
          download(response.data, fn, content);
        })
        .catch((error) => console.log(error));
    }

    try {
      await downloadFile(fileName);
    } catch (e) {
      console.log("e ::", e);
    }
    getData()
  };

  return (
    <Page>
      <Card
        title="Simplified E-Commerce Accounting - Synchronise Data with Tally"
      >
        <Card.Section >
          <Layout>
            <Layout.Section>
              <Banner>
                <p>Use Tally.ERP9 / Tally Prime to Manage your Accounting & Statutory Compliances while also simplifying product uploads to Shopify.</p>
                <p> Create Products, Upload Product Images, Manage Accurate Accounting with Statutory Compliances, Keep Accutate Records.</p>
              </Banner>
            </Layout.Section>
            {/* {isPlanActive ? console.log("Is Order Plan Active :: ", isOrderPlan, "New Order Limit :: ", orderRecLimit, "New Product Limit :: ", productLimit, "New Image Limit :: ", imageLimit) : null} */}
            {serial ? (
              <>
                <Layout.Section>
                  <Stack>
                    <Stack.Item fill>
                      <Heading element="h1">Tally.ERP9 / Tally Prime :</Heading>
                    </Stack.Item>
                    <Stack.Item>
                      <Heading element='h3'>
                        {isPrime ? "Tally Prime" : "Tally.ERP9"}
                      </Heading>
                    </Stack.Item>
                  </Stack>
                  <Stack>
                    <Stack.Item fill>
                      <Heading element="h1">Serial Number : </Heading>
                    </Stack.Item>
                    <Stack.Item>
                      <Heading element='h3'>{serial}</Heading>
                    </Stack.Item>
                  </Stack>
                  <Stack>
                    <Stack.Item fill>
                      <Heading element="h1">Access Token : </Heading>
                    </Stack.Item>
                    <Stack.Item>
                      <Heading element='h3'>{userAccessToken}</Heading>
                    </Stack.Item>
                  </Stack>
                </Layout.Section>
              </>
            ) : null}
            {isPlanActive
              ? <>
                <Layout.Section>
                  <Stack>
                    <Stack.Item fill>Active Plan :</Stack.Item>
                    {isFreePlan
                      ? <Stack.Item>Free</Stack.Item>
                      : <>{isMonthlyPlan
                        ? <Stack.Item>Periodic</Stack.Item>
                        : <>{isOrderPlan
                          ? <Stack.Item>Order Based</Stack.Item>
                          : "None"}
                        </>}
                      </>}
                  </Stack>
                  <Stack>
                    <Stack.Item fill>Plan Expiry</Stack.Item>
                    <Stack.Item>{planExpiry}</Stack.Item>
                  </Stack>
                  <Stack>
                    <Stack.Item fill>Plan Near Expiry : </Stack.Item>
                    <Stack.Item>
                      {planNearExp ? 'Yes' : 'No'}
                    </Stack.Item>
                  </Stack>
                  <Stack>
                    <Stack.Item fill>Max Number of Orders</Stack.Item>
                    <Stack.Item >{orderRecLimit != null ? orderRecLimit : "unlimited"}</Stack.Item>
                  </Stack>
                  <Stack>
                    <Stack.Item fill>Max Number of Products</Stack.Item>
                    <Stack.Item >{productLimit != null ? productLimit : "unlimited"}</Stack.Item>
                  </Stack>
                  <Stack>
                    <Stack.Item fill>Max Number of Images</Stack.Item>
                    <Stack.Item >{imageLimit != null ? imageLimit : "unlimited"}</Stack.Item>
                  </Stack>
                  {isFPAOnce
                    ? <>
                      <Stack>
                        <Stack.Item fill>Is Free Plan Activated already : </Stack.Item>
                        <Stack.Item>Yes</Stack.Item>
                      </Stack>
                    </>
                    : <>
                      <Stack>
                        <Stack.Item fill>Is Free Plan Activated already : </Stack.Item>
                        <Stack.Item>No</Stack.Item>
                      </Stack>
                    </>
                  }
                  {icCharged
                    ? <>
                      <Stack>
                        <Stack.Item fill>Is Installation Charges Charged : </Stack.Item>
                        <Stack.Item>Yes</Stack.Item>
                      </Stack>
                    </>
                    : <>
                      <Stack>
                        <Stack.Item fill>Is Installation Charges Charged : </Stack.Item>
                        <Stack.Item>No</Stack.Item>
                      </Stack>
                    </>
                  }
                </Layout.Section>
              </>
              : null}
            {/* <Layout.Section> */}
            {isPlanActive ? (
              <>
                <Layout.Section>
                  <Heading element="h1">
                    Data Synchronised with Tally till Date
                  </Heading>
                  <Stack>
                    <Stack.Item fill>
                      <Heading element='h5'>Consumption</Heading>
                    </Stack.Item>
                  </Stack>
                  {product ? (
                    <>
                      <Stack>
                        <Stack.Item fill>Products Uploaded :</Stack.Item>
                        <Stack.Item>{product}</Stack.Item>
                      </Stack>
                    </>
                  ) : null}
                  {image ? (
                    <>
                      <Stack>
                        <Stack.Item fill>Images Uploaded :</Stack.Item>
                        <Stack.Item>{image}</Stack.Item>
                      </Stack>
                    </>
                  ) : null}
                  {orderRec ? (
                    <>
                      <Stack>
                        <Stack.Item fill>Orders Processed : </Stack.Item>
                        <Stack.Item>{orderRec}</Stack.Item>
                      </Stack>
                    </>
                  ) : null}
                  {orderDel ? (
                    <>
                      <Stack>
                        <Stack.Item fill>Orders Delivered : </Stack.Item>
                        <Stack.Item>{orderDel}</Stack.Item>
                      </Stack>
                    </>
                  ) : null}
                  {orderRet ? (
                    <>
                      <Stack>
                        <Stack.Item fill>Orders Returned : </Stack.Item>
                        <Stack.Item>{orderRet}</Stack.Item>
                      </Stack>
                    </>
                  ) : null}
                  <Layout sectioned>
                    <Button
                      onClick={handleToggle}
                      ariaExpanded={open || !serial}
                      ariaControls="basic-collapsible"
                      outline
                      fullWidth={true}
                    >
                      Show Processed Data
                    </Button>
                    <Collapsible
                      open={open}
                      id="basic-collapsible"
                      transition={{
                        duration: "500ms",
                        timingFunction: "ease-in-out",
                      }}
                      expandOnPrint
                    >
                      <DataTable
                        columnContentTypes={[
                          // "string",
                          "date",
                          "string",
                          "string",
                          "string",
                          "string",
                          "string",
                          "string",
                        ]}
                        headings={[
                          // "id",
                          "Date",
                          "Type",
                          "ProcessID",
                          "Status",
                          "URL",
                          "SystemName",
                          "IP",
                        ]}
                        rows={result}
                      />
                    </Collapsible>
                  </Layout>
                </Layout.Section>

              </>)
              : null}
            {/* </Layout.Section> */}
            <Layout.Section>
              <>
                <Form
                  onSubmit={handleSubmitSerial}
                  title="Registration"
                  preferredAlignment={screenLeft}
                >
                  <FormLayout>
                    {!serial
                      ? <>
                        <Stack>
                          <Stack.Item fill>
                            <Heading element="h1">
                              Select version of Tally you are using :
                            </Heading>
                          </Stack.Item>
                          <Stack.Item>
                            <ButtonGroup segmented>
                              <Button pressed={!isPrime} onClick={handleIsPrime}>Tally.ERP9</Button>
                              <Button pressed={isPrime} onClick={handleIsPrime}>Tally Prime</Button>
                            </ButtonGroup>
                          </Stack.Item>
                        </Stack>
                        <p>
                          download latest version of Tally Prime from
                          <Link url='https://tallysolutions.com/download' external={true}> https://tallysolutions.com/download</Link>
                        </p>
                        <Stack>
                          <Stack.Item fill>
                            <Heading element="h1">
                              Test App in Educational Mode
                            </Heading>
                          </Stack.Item>
                          <Stack.Item>
                            {edMode ? (
                              <Button pressed={edMode} onClick={handleEdButton}>
                                True
                              </Button>
                            ) : (
                              <Button pressed={edMode} onClick={handleEdButton}>
                                False
                              </Button>
                            )}
                          </Stack.Item>
                        </Stack>
                        <Collapsible
                          open={!edMode}
                          id="basic-collapsible"
                          transition={{
                            duration: "500ms",
                            timingFunction: "ease-in-out",
                          }}
                          expandOnPrint
                        >
                          <TextField
                            value={serialNum}
                            onChange={handleSerialChange}
                            label="Tally Serial Number"
                            type="number"
                            maxlength={9}
                            minlength={9}
                            min="700000000"
                            max="800000000"
                          />
                          <Button primary={true} fullWidth={true} submit>Submit</Button>
                        </Collapsible>
                      </>
                      : null
                    }
                    {/* {!isPlanActive || isFreePlan || isOrderPlan ? AddOnPlans() : null} */}
                    {/* {isMonthlyPlan ? null : AddOnPlans()} */}
                  </FormLayout>
                </Form>
              </>
            </Layout.Section>
          </Layout>
        </Card.Section>
      </Card>
      <Card>
        <Card.Section>
          <Layout>
            <Layout.Section>
              <Button
                pressed={!showPlans}
                onClick={handleShowPlans}
                outline
                fullWidth={true}
                ariaExpanded={showPlans}
                ariaControls="basic-collapsible"
              >
                Show Plans / Add ons
              </Button>
              <Collapsible
                open={!showPlans}
                id="basic-collapsible"
                transition={{
                  duration: "500ms",
                  timingFunction: "ease-in-out",
                }}
                expandOnPrint
              >
                {!isFPAOnce
                  ? FreeBillingPlan()
                  : null
                }
                {isMonthlyPlan ?
                  <>
                    {planNearExp ?
                      <>
                        <Heading element='h1'>Your Usage is about to reach the limits</Heading>
                        {BillingPlans()}
                      </>
                      :
                      <>
                        {BillingPlans()}
                      </>
                    }
                  </>
                  :
                  <>
                    {BillingPlans()}
                    {AddOnPlans()}
                  </>
                }
              </Collapsible>
            </Layout.Section>
          </Layout>
        </Card.Section>
      </Card>
      <Card>
        <Card.Section id="features">
          <Button
            onClick={handleFeatToggle}
            outline
            fullWidth={true}
            ariaExpanded={featureOpen}
            ariaControls="basic-collapsible"
          >
            Features
          </Button>
          <Collapsible
            open={featureOpen || !serial}
            id="basic-collapsible"
            transition={{
              duration: "500ms",
              timingFunction: "ease-in-out",
            }}
            expandOnPrint
          >
            <List type="bullet">
              <List.Item>Scope of Duplication : 0</List.Item>
              <List.Item>need to Import / Export Data : 0</List.Item>
              <List.Item>
                Fully Automated Synchronisation of Orders & Tracking Status
              </List.Item>
              <List.Item>
                Create Stock Item / Group in Tally.ERP9 / Tally Prime with
                Images and post them as Single / Multi Variant Products on
                Shopify
              </List.Item>
              <List.Item>
                Order Process :
                <List type="number">
                  <List.Item>
                    Receive Orders in Tally.ERP9 / Tally Prime as soon as they
                    are booked on Shopify
                  </List.Item>
                  <List.Item>
                    Material dispatch entry is booked in Tally.ERP9 / Tally
                    Prime along with courier details once the Material is
                    Dispatched
                  </List.Item>
                  <List.Item>
                    keep track of material with the link provided in the
                    Tally.ERP9 / Tally Prime interface
                  </List.Item>
                  <List.Item>
                    Sales Entry is booked with necessary adjustment entry for
                    COD Partner / Payment Gateway.
                  </List.Item>
                  <List.Item>
                    Easy reconciliation with COD Partner / Payment Gateway
                  </List.Item>
                  <List.Item>
                    In case Material is returned undelivered / post delivery,
                    Automated rejection note is duly processed
                  </List.Item>
                  <List.Item>
                    Automated Reversal is done for COD partner / Payment
                    Gateway
                  </List.Item>
                </List>
              </List.Item>
            </List>
          </Collapsible>
        </Card.Section>
      </Card>
      <Card>
        <div className="player-wrapper" title="Steps to Implement">
          <ReactPlayer
            className="react-player"
            controls={true}
            url={url1}
            width="100%"
            height="100%"
          />
        </div>
      </Card>
      <Card>
        <div
          className="player-wrapper"
          title="Map Existing Products on Shopify with Tally Prime"
        >
          <ReactPlayer
            className="react-player"
            controls={true}
            url={url2}
            width="100%"
            height="100%"
          />
        </div>
      </Card>
      <Card>
        <div
          className="player-wrapper"
          title="Post Stock Group in Tally Prime as Multi Variant Product on Shopify with Image"
        >
          <ReactPlayer
            className="react-player"
            controls={true}
            url={url3}
            width="100%"
            height="100%"
          />
        </div>
      </Card>
      <Card>
        <div
          className="player-wrapper"
          title="Processing Orders on Shopify in Tally Prime"
        >
          <ReactPlayer
            className="react-player"
            controls={true}
            url={url4}
            width="100%"
            height="100%"
          />
        </div>
      </Card>
      <Card>
        <Card.Section title="Developer">
          <Layout>
            <Layout.Section>
              <Heading>See-D Solutions</Heading>
              <br />
              <p>5, Sai Prasad Building, 1st Floor,</p>
              <p>3rd MamletdarWadi, Malad (West),</p>
              <p>Mumbai - 400064., Maharashtra, India</p>
              <br />
              <p>Support : +919082048148</p>
              <br />
              <p>E-mail : info@tallyecom.in</p>
            </Layout.Section>
          </Layout>
        </Card.Section>
      </Card>
    </Page>
  );
}

export default Index;
