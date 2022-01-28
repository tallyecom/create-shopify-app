import React, { useEffect, useState, useCallback } from "react";
import download from "downloadjs";
import {
  Form,
  FormLayout,
  TextField,
  Button,
  DisplayText,
  Layout,
  Banner,
  Page,
  Card,
  Heading,
  Subheading,
  List,
  Link,
  TextContainer,
  DataTable,
  Stack,
  Badge,
  VideoThumbnail,
  Collapsible,
  MediaCard,
  ButtonGroup,
} from "@shopify/polaris";
import axios from "axios";
import ReactPlayer from "react-player/lazy";
// import BillingWOFree from "./billingwofree";
// import BillingWithFree from "./billingwithfree"
import { render } from "react-dom";

const Index = () => {

  const [installedDays, setInstalledDays] = useState("");
  const [isPlanActive, setIsPlanActive] = useState(false);
  const [planNearExp, setPlanNearExp] = useState(false);
  const [isFreePlan, setIsFreePlan] = useState(false);
  const [isOrderAddOnPlan, setIsOrderAddOnPlan] = useState(false);
  const [planUsageDetails, setPlanUsageDetails] = useState([]);
  const [changePlantoFree, setChangePlantoFree] = useState(false);
  const [changePlantoOrder, setChangePlantoOrder] = useState(false);
  const [changePlantoMonth, setChangePlantoMonth] = useState(false);
  const [isMonthlyPlan, setIsMonthlyPlan] = useState(false);
  const [isOrderPlan, setIsOrderPlan] = useState(false);
  const [isProductAddOnPlan, setIsProductAddOnPlan] = useState(false);
  const [isImageAddOnPlan, setIsImageAddOnPlan] = useState(false);
  const [isProductPlan, setIsProductPlan] = useState(false);
  const [productLimit, setProductLimit] = useState(0);
  const [imageLimit, setImageLimit] = useState(0);
  const [orderRecLimit, setOrderRecLimit] = useState(0);
  const [orderDelLimit, setOrderDelLimit] = useState(0);
  const [orderRetLimit, setOrderRetLimit] = useState(0);
  const [serialNum, setSerialNum] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [serial, setSerial] = useState("");
  const [process, setProcess] = useState([]);
  const [result, setResult] = useState([]);
  const [listOfPlans, setListOfPlans] = useState([]);
  const [orderRec, setOrderRec] = useState(0);
  const [orderDel, setOrderDel] = useState(0);
  const [orderRet, setOrderRet] = useState(0);
  const [product, setProduct] = useState(0);
  const [image, setImage] = useState(0);
  const [open, setOpen] = useState(false);
  const [userAccessToken, setUserAccessToken] = useState("");
  const [edMode, setEdMode] = useState(false);
  const [featureOpen, setFeatureOpen] = useState(
    serialNum === null ? true : false
  );

  const [isPrime, setIsPrime] = useState(false);
  let url1 = `https://www.youtube.com/embed/xKC_wnO1fFc?enablejsapi=1&origin=https://${window.location.host}&host=https://www.youtube.com`;
  let url2 = `https://www.youtube.com/embed/3LZ-i-JOmZE?enablejsapi=1&origin=https://${window.location.host}&host=https://www.youtube.com`;
  let url3 = `https://www.youtube.com/embed/P7q_7k8t3-I?enablejsapi=1&origin=https://${window.location.host}&host=https://www.youtube.com`;
  let url4 = `https://www.youtube.com/embed/uZ-DQhNqlzc?enablejsapi=1&origin=https://${window.location.host}&host=https://www.youtube.com`;

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

  function PlanCard(props) {
    const {
      objID,
      keyID,
      planId,
      isSelected,
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
    const [isActive, setStatus] = React.useState(false);
    const activator = (
      <Button
        onClick={() => setStatus(!isActive)}
        primary
        fullWidth={true}
        disabled={isSelected}
        size="large"
      >
        {isSelected ? "Current Plan" : "Select"}
      </Button>
    );
    return (
      <>
        <Layout.Section key={keyID} secondary >
          {/* {console.log('while actual rendering of component')} */}
          {/* {console.log("Plan is Active :: ", isPlanActive, "Plan Near Expiry :: ", planNearExp, "Number of Orders Received :: ", orderRec)} */}
          {/* if no plan is active & order received count = 0 */}
          {orderRec === 0
            ? <>
              {!isPlanActive
                ? <>
                  {planId == 1
                    ? <Heading element='h1'>Kindly Select a Plan</Heading>
                    : <Heading element='h1'> .</Heading>}
                </>
                : null
              }
            </>
            : null
          }
          {/* if no plan is active & order received count > 0 meaning there was an active plan earlier */}
          {orderRec !== 0
            ? <>
              {!isPlanActive
                ? <>
                  {planId == 2
                    ? <Heading element='h1'>Kindly Select a Plan</Heading>
                    : <Heading element='h1'> .</Heading>
                  }
                </>
                : null
              }
            </>
            : null
          }
          {isPlanActive
            ? <>
              {planNearExp
                ? <>
                  {planId == 2 ?
                    <Heading element='h1'>Kindly Select a Plan</Heading>
                    : <Heading element='h1'> .</Heading>}
                </>
                : null
              }
            </>
            : null
          }

          <Card title={title}>
            <div style={{ height: 170 }} >
              {
                monthlyPrice === 0 ?
                  <>
                    {productPrice !== 0 ? <DisplayText size="large">${productPrice}/{numProducts} Products</DisplayText> : null}
                    {orderPrice !== 0 ? <DisplayText size="large">${orderPrice}/{numOrders} Orders</DisplayText> : null}
                    {imagePrice !== 0 ? <DisplayText size="large">${imagePrice}/{numImages} Images</DisplayText> : null}
                    {title == 'Free' ? <DisplayText size="large">${orderPrice}/{numOrders} Orders</DisplayText> : null}
                    <Stack>
                      <Stack.Item fill>Maximum Number of Orders</Stack.Item>
                      <Stack.Item>{numOrders}</Stack.Item>
                    </Stack>
                    <Stack>
                      <Stack.Item fill>Maximum Number of Products</Stack.Item>
                      <Stack.Item>{numProducts}</Stack.Item>
                    </Stack>
                    <Stack>
                      <Stack.Item fill>Maximum Number of Images</Stack.Item>
                      <Stack.Item>{numImages}</Stack.Item>
                    </Stack>
                    {title == 'Free' ? <p>Period: 1 month</p> : <p >Period : use at your convenience with Balance Carry Forward for all 3 Orders, Products & Images</p>}
                    {title == 'Free' ? <p>Available only One Time</p> : null}
                  </>
                  :
                  <>
                    <DisplayText size="large">${monthlyPrice}/Month</DisplayText>
                    <p >
                      or ${annualPriceA}/month billed at ${annualPriceB} once per year
                    </p>
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
                  </>
              }
            </div>
            {planId == 1
              ? <>
                <input id="1" value={objID} />
                <Button fullWidth primary size="large" disabled={orderRec !== 0} onClick={handleFreePlan}>Select Free Plan</Button>
                <Button fullWidth disabled>
                  {productPrice !== 0 ? `$${productPrice} / ${numProducts} Products` : null}
                  {orderPrice !== 0 ? `$${orderPrice} / ${numOrders} Orders` : null}
                  {imagePrice !== 0 ? `$${imagePrice} / ${numImages} Images` : null}
                  {title == 'Free' ? `$${orderPrice} / ${numOrders} Orders` : null}
                </Button>
              </> : null}
            {planId == 2
              ? <>
                <input id="2" value={objID} />
                <Button fullWidth primary size="large" onClick={handleOrderPlan}>Select Order Based Plan</Button>
                <Button fullWidth disabled>
                  {productPrice !== 0 ? `$${productPrice} / ${numProducts} Products` : null}
                  {orderPrice !== 0 ? `$${orderPrice} / ${numOrders} Orders` : null}
                  {imagePrice !== 0 ? `$${imagePrice} / ${numImages} Images` : null}
                  {title == 'Free' ? `$${orderPrice} / ${numOrders} Orders` : null}
                </Button>
              </> : null}
            {planId == 3
              ? <>
                <input id="3" value={objID} />
                <Button fullWidth secondary onClick={handleYearlyPlan}>$550 / Year</Button>
                <Button fullWidth primary onClick={handleMonthlyPlan}>$50 / Month</Button>
              </>
              : null}
            {planId == 4
              ? <>
                <input id="4" value={objID} />
                <Button fullWidth primary size="large" onClick={handleOrdersAddOn}>Select Orders Add On</Button>
                <Button fullWidth disabled>
                  {productPrice !== 0 ? `$${productPrice} / ${numProducts} Products` : null}
                  {orderPrice !== 0 ? `$${orderPrice} / ${numOrders} Orders` : null}
                  {imagePrice !== 0 ? `$${imagePrice} / ${numImages} Images` : null}
                  {title == 'Free' ? `$${orderPrice} / ${numOrders} Orders` : null}
                </Button>
              </> : null}
            {planId == 5
              ? <>
                <input id="5" value={objID} />
                <Button fullWidth primary size="large" onClick={handleProductsAddOn} >Select Products Add On</Button>
                <Button fullWidth disabled>
                  {productPrice !== 0 ? `$${productPrice} / ${numProducts} Products` : null}
                  {orderPrice !== 0 ? `$${orderPrice} / ${numOrders} Orders` : null}
                  {imagePrice !== 0 ? `$${imagePrice} / ${numImages} Images` : null}
                  {title == 'Free' ? `$${orderPrice} / ${numOrders} Orders` : null}
                </Button>
              </>
              : null}
            {planId == 6
              ? <>
                <input id="6" value={objID} />
                <Button fullWidth primary size="large" onClick={handleImagesAddOn} >Select Images Add On</Button>
                <Button fullWidth disabled>
                  {productPrice !== 0 ? `$${productPrice} / ${numProducts} Products` : null}
                  {orderPrice !== 0 ? `$${orderPrice} / ${numOrders} Orders` : null}
                  {imagePrice !== 0 ? `$${imagePrice} / ${numImages} Images` : null}
                  {title == 'Free' ? `$${orderPrice} / ${numOrders} Orders` : null}
                </Button>
              </>
              : null}
          </Card>
        </Layout.Section>
      </>
    );
  }

  async function getData() {
    console.log('setting process data')
    try {
      const res = await axios.get("/api/shop?shop=" + shop);
      if (res) console.log(res.data.data);
      if (res.data.data.isFreePlan) setIsFreePlan(res.data.data.isFreePlan)
      if (res.data.data.isOrderPlan) setIsOrderPlan(res.data.data.isOrderPlan);
      if (res.data.data.isMonthlyPlan) setIsMonthlyPlan(res.data.data.isMonthlyPlan);
      console.log("Is free plan active :: ", res.data.data.isFreePlan)
      var instOn = new Date(res.data.data.installedOn);
      var dateDif = datediff(instOn, new Date(), 'days')
      if (dateDif < 31) {
        dateDif = datediff(instOn, new Date(), 'days');
        setInstalledDays(dateDif, " Days");
      }
      if (dateDif >= 31 && dateDif < 365) {
        dateDif = datediff(instOn, new Date(), 'months');
        setInstalledDays(dateDif, " Months");
      }
      if (dateDif > 365) {
        dateDif = datediff(instOn, new Date(), 'years');
        setInstalledDays(dateDif, " Years");
      }

      setSerial(res.data.data.serial);
      setIsPrime(res.data.data.isPrime);
      setUserAccessToken(res.data.data.accessToken);
      setProcess(res.data.data.process);
      var array = res.data.data.process
        ? res.data.data.process.map(
          ({ date, type, processid, status, url, systemName, ip }) => {
            return [date, type, processid, status, url, systemName, ip];
          }
        )
        : [];

      setResult(array);
      setOrderRec(
        res.data.data.process.filter(function (e) {
          return e.type == "order" && e.status == "received";
        }).length
      );

      // setIsPlanActive(true);
      // setIsPlanActive(!setIsPlanActive);
      // setPlanNearExp(true);
      // setOrderRec(30);
      // setOrderDel(20)
      // setOrderRet(1);
      // setProduct(50);

      // if (orderRec !== 0) setPlanNearExp(false);
      // if (orderRec === 0 || !orderRec) setPlanNearExp(true);

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
    } catch (e) {
      setSerial(null);
      setProcess([]);
      setResult([]);
      console.log("ee : ", e);
    }
  }

  async function getPlans() {
    // console.log('setting plans :: ')
    // setIsPlanActive(true);
    // setIsPlanActive(!setIsPlanActive);
    // setPlanNearExp(true);
    // setOrderRec(30);
    // setOrderDel(20)
    // setOrderRet(1);
    // setProduct(50);

    // if (orderRec !== 0) setPlanNearExp(false);
    // if (orderRec === 0 || !orderRec) setPlanNearExp(true);
    try {
      const res = await axios.get("/api/plans?shop=" + shop);
      // if (res) console.log(res.data.data.planDetail);
      // console.log("Plan is Active :: ", isPlanActive, "Plan Near Expiry", planNearExp)
      if (isPlanActive) {
        if (planNearExp) {
          if (res) {
            let planDetail = res.data.data.planDetail;
            planDetail = planDetail.sort((a, b) => {
              return a.id - b.id;
            }).filter(plans => plans.name !== 'Free');
            setListOfPlans(planDetail);
            // console.log("List of Plans Filtered", planDetail);
          }
        }
      }
      // console.log("Plan is Active :: ", isPlanActive, "Number of Orders Processed :: ", orderRec)
      if (orderRec === 0) {
        if (!isPlanActive) {
          if (res) {
            let planDetail = res.data.data.planDetail;
            planDetail = planDetail.sort((a, b) => {
              return a.id - b.id;
            });
            setListOfPlans(planDetail);
            // console.log("setting list of plans :: ", planDetail);
          }
        }
      }
      // console.log("Plan is Active :: ", isPlanActive, "Number of Orders Processed :: ", orderRec)
      if (orderRec !== 0) {
        if (!isPlanActive) {
          if (res) {
            let planDetail = res.data.data.planDetail;
            for (var i = 0; i < planDetail.length; i++) {
              // console.log("Before Filter is Applied :: ", planDetail[i].name)
            }
            planDetail = planDetail.sort((a, b) => {
              return a.id - b.id;
            }).filter(function (e) {
              return e.name != "Free";
            })
            for (var i = 0; i < planDetail.length; i++) {
              // console.log("After Filter is Applied :: ", planDetail[i].name)
            }
            //.filter(plans => plans.name !== 'Free');
            setListOfPlans(planDetail);
            // console.log("List of Plans Filtered", planDetail);
          }
        }
      }
      // console.log(planArray);
    } catch (e) {
      console.log("errors while fatching plans ::", e)
    }
  }

  function BillingPlansWoFree() {
    if (listOfPlans) return (
      <>
        <Layout>
          {listOfPlans.map(plan => (
            <PlanCard
              objID={plan._id}
              isSelected={plan.id == 2}
              planId={plan.id}
              key={`key_${plan.id}`}
              title={plan.name}
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
  function BillingPlansWithFree() {

    // const plans = listOfPlans
    if (listOfPlans) return (
      <>
        <Layout>
          {listOfPlans.map(plan => (
            <PlanCard
              objID={plan._id}
              isSelected={plan.id == 1}
              planId={plan.id}
              key={`key_${plan.id}`}
              title={plan.name}
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
    };
    intialSetup();
  }, []);
  const handleFreePlan = useCallback(() => {
    getPlans();
    console.log("Plan Details before filtering :: ", listOfPlans);
    let id = document.getElementById('1').value
    console.log(id);
    console.log("filtered Plan Detail :: ", listOfPlans.length);
    let filtplan = listOfPlans//.filter(plan => plan._id == id)
    if (filtplan) console.log(filtplan);
  }, []);
  const handleOrderPlan = useCallback(() => { console.log(document.getElementById('2').value); }, []);
  const handleYearlyPlan = useCallback(() => { console.log(document.getElementById('3').value); }, []);
  const handleMonthlyPlan = useCallback(() => { console.log(document.getElementById('3').value); }, []);
  const handleOrdersAddOn = useCallback(() => { console.log(document.getElementById('4').value); }, []);
  const handleProductsAddOn = useCallback(() => { console.log(document.getElementById('5').value); }, []);
  const handleImagesAddOn = useCallback(() => { console.log(document.getElementById('6').value); }, []);


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

    setChangePlantoMonth(false);
    if (changePlantoMonth) {
      console.log("Changing plan to Monthly Plan")
      if (!isPlanActive) setIsPlanActive(true);
      console.log(isPlanActive);
      setIsMonthlyPlan(true);
      setOrderRecLimit(0);
      setProductLimit(0);
      setImageLimit(0);
      setChangePlantoMonth(false);
    }
    setChangePlantoFree(true);
    console.log("Plan Changed to Free ::", changePlantoFree);
    if (changePlantoFree) {
      console.log("Changing plan to Free Plan")
      if (!isPlanActive) setIsPlanActive(true);
      console.log(isPlanActive);
      setIsFreePlan(true);
      setOrderRecLimit(90);
      setProductLimit(90);
      setImageLimit(90);
      setChangePlantoFree(false);
      console.log("Plan Changed to Non-Free for next round ::", changePlantoFree);
    }
    setChangePlantoOrder(false);
    if (changePlantoOrder) {
      console.log("Changing Plan to Order based Plan")
      if (!isPlanActive) setIsPlanActive(true);
      console.log(isPlanActive);
      setIsOrderPlan(true);
      setOrderRecLimit(orderRecLimit + 1000);
      setProductLimit(productLimit + 1000);
      setImageLimit(imageLimit + 3000);
      setChangePlantoOrder(false);
    }
    setIsProductAddOnPlan(false)
    if (isProductAddOnPlan) {
      console.log("Changing plan to product add on")
      if (!isPlanActive) setIsPlanActive(true);
      console.log(isPlanActive);
      setOrderRecLimit(0);
      setProductLimit(productLimit + 1000);
      setImageLimit(0);
    }
    setIsImageAddOnPlan(false)
    if (isImageAddOnPlan) {
      console.log("Changing plan to image add on")
      if (!isPlanActive) setIsPlanActive(true);
      console.log(isPlanActive);
      setOrderRecLimit(0);
      setProductLimit(0);
      setImageLimit(imageLimit + 3000);
    }
    setIsOrderAddOnPlan(false);
    if (isOrderAddOnPlan) {
      console.log("Changing plan to Order add on")
      if (!isPlanActive) setIsPlanActive(true);
      console.log(isPlanActive);
      setOrderRecLimit(orderRecLimit + 1000);
      setProductLimit(0);
      setImageLimit(0);
    }
    setPlanUsageDetails([
      isPlanActive,
      planNearExp,
      isFreePlan,
      isOrderPlan,
      isMonthlyPlan,
      orderRecLimit,
      orderRec,
      orderDelLimit,
      orderDel,
      orderRetLimit,
      orderRet,
      productLimit,
      product,
      imageLimit,
      image])
    console.log("Plan Usage Details :: ", planUsageDetails);

    console.log("with active Plan :: ", isPlanActive);
    console.log("Plan Near Expiry :: ", planNearExp);

    if (serialNum % 9 === 0) {
      try {
        axios
          .post("/api/regForm", {
            shop: shop,
            serialNumber: serialNum,
            tallyPrime: isPrime,
            isFreePlan: isFreePlan,
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
  };

  const plans = listOfPlans;

  return (
    <Page>
      <Card>
        <Card.Section title="Simplified E-Commerce Accounting - Synchronise Data with Tally">
          <Layout>
            <Layout.Section>
              <Banner>
                <p>
                  Create Products, Manage Customers, Track Orders, Keep Accutate
                  Records, Easy Statutory Compliances - Use Tally.ERP9 / Tally
                  Prime to Manage your Accounting & Statutory Compliances while
                  also simplifying product uploads to Shopify.
                </p>
              </Banner>
              <Stack>
                <Stack.Item fill>
                  <Heading element="h1">Has Active Plan : </Heading>
                </Stack.Item>
                <Stack.Item>
                  <Heading element="h3">{isPlanActive ? 'Yes' : 'No'}</Heading>
                </Stack.Item>
                <Stack.Item fill>
                  <Heading element="h1">Plan Near Expiry : </Heading>
                </Stack.Item>
                <Stack.Item>
                  <Heading element='h3'>{planNearExp ? 'Yes' : 'No'}</Heading>
                </Stack.Item>
              </Stack>
              <Stack>
                <Stack.Item fill>
                  <Heading element='h1'>Active Plan :</Heading>
                </Stack.Item>
                <Stack.Item>
                  {isFreePlan ? 'Free' : null}
                  {isMonthlyPlan ? 'Periodic' : null}
                  {isOrderPlan ? 'Order Based' : null}
                  None
                </Stack.Item>
              </Stack>
            </Layout.Section>
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
            ) : (
              <>
                <Form
                  onSubmit={handleSubmitSerial}
                  title="Registration"
                  preferredAlignment={screenLeft}
                >
                  <FormLayout>
                    <Stack>
                      <Stack.Item fill>
                        <Heading element="h1">
                          Select version of Tally you are using :
                        </Heading>
                      </Stack.Item>
                      <Stack.Item>
                        {isPrime ? (
                          <Button pressed={isPrime} onClick={handleIsPrime}>Tally Prime</Button>
                        ) : (
                          <Button pressed={isPrime} onClick={handleIsPrime}>Tally.ERP9</Button>
                        )}
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
                    </Collapsible>
                    <Button primary={true} fullWidth={true} submit>
                      Submit
                    </Button>
                  </FormLayout>
                </Form>

              </>
            )}
            <Layout.Section>
              {isPlanActive && (product || image || orderRec || orderDel || orderRet) ? (
                <>
                  <Layout.Section>
                    <Heading element="h1">
                      Data Synchronised with Tally till Date
                    </Heading>
                    <Stack.Item fill>
                      <Heading element='h5'>Limits</Heading>
                    </Stack.Item>
                    {/* <Stack.Item>.</Stack.Item> */}
                    <Stack>
                      <Stack.Item fill>Products Limit :</Stack.Item>
                      <Stack.Item>{isMonthlyPlan ? "Unlimited" : productLimit}</Stack.Item>
                    </Stack>
                    <Stack>
                      <Stack.Item fill>Images Limit :</Stack.Item>
                      <Stack.Item>{isMonthlyPlan ? "Unlimited" : imageLimit}</Stack.Item>
                    </Stack>
                    <Stack>
                      <Stack.Item fill>Orders Limit :</Stack.Item>
                      <Stack.Item>{isMonthlyPlan ? "Unlimited" : orderRecLimit}</Stack.Item>
                    </Stack>
                    <Stack>
                      <Stack.Item fill>
                        <Heading element='h5'>Consumption</Heading>
                      </Stack.Item>
                      {/* <Stack.Item>.</Stack.Item> */}
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
                    {orderRec ? (
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
                </>
              ) : null}
              {/* <Layout>
                <Layout.Section>
                  <DataTable
                    columnContentTypes={[
                      "Number",
                      "Logical",
                      "String",
                      "String",
                      "Number",
                      "Number",
                      "Number",
                      "Number",
                      "Number",
                      "Number",
                      "Number",
                      "Number",
                    ]}
                    headings={[
                      "id",
                      "isSelected",
                      "keyId",
                      "Plan Name",
                      "per Month",
                      "per Year",
                      "per Order",
                      "per Product",
                      "per Image",
                      "Number of Orders",
                      "Number of Products",
                      "Number of Images"
                    ]}
                    rows={listOfPlans}
                  />
                </Layout.Section>
              </Layout> */}

              {/* <Layout>
                {console.log("Plans List :: ", listOfPlans)}
                {console.log("Plans List Mapping :: ", listOfPlans.map(Object.values))}
                {listOfPlans.map((
                  <PlanCard
                    isSelected={Object.id == "1"}
                    planId={Object.id}
                    key={`key_${Object.id}`}
                    title={Object.name}
                    orderPrice={Object.orderPrice}
                    productPrice={Object.productPrice}
                    imagePrice={Object.imagePrice}
                    numOrders={Object.numOrders}
                    numProducts={Object.numProducts}
                    numImages={Object.numImages}
                    monthlyPrice={Object.monthlyPrice}
                    annualPriceA={(Object.annualPrice / 12).toFixed(2)}
                    annualPriceB={Object.annualPrice}
                  />
                ))}
              </Layout> */}

              {orderRec === 0 ? <>{!isPlanActive ? BillingPlansWithFree() : null}</> : null}

              {orderRec !== 0 ? <>{!isPlanActive ? BillingPlansWoFree() : null}</> : null}

              {isPlanActive ?
                <>{planNearExp
                  ? <>
                    <Heading element='h1'>Your Usage is about to reach the limits</Heading>
                    {BillingPlansWoFree()}
                  </>
                  : null
                }
                </>
                : null
              }
            </Layout.Section>
          </Layout>
        </Card.Section>
      </Card>
      <Card>
        <Layout.Section id="features">
          <Card.Section>
            <Button
              outline
              fullWidth={true}
              onClick={handleFeatToggle}
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
        </Layout.Section>
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
    </Page >
  );
};

export default Index;
