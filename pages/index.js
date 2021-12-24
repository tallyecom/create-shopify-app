import React, { useEffect, useState, useCallback } from "react";
import {
  Form,
  FormLayout,
  TextField,
  Button,
  Layout,
  Banner,
  Page,
  Card,
  Heading,
  Subheading,
  List,
  TextContainer,
  DataTable,
  Stack,
  Badge,
  VideoThumbnail,
  Collapsible,
  MediaCard,
  ButtonGroup,
} from "@shopify/polaris";
import Link from "next/link";
import axios from "axios";
import ReactPlayer from "react-player/lazy";
// import YouTube from "react-youtube";

// const img = "https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg";

const Index = () => {
  const [serialNum, setSerialNum] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  // const [data, setData] = useState(null);
  const [serial, setSerial] = useState("");
  const [process, setProcess] = useState([]);
  const [result, setResult] = useState([]);
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

  const getData = async () => {
    try {
      const res = await axios.get("/api/shop?shop=" + shop);
      // console.log(res);
      // console.log(res.data);
      // console.log(res.data.data);
      // console.log(res.data.data.serial);
      setSerial(res.data.data.serial);
      setUserAccessToken(res.data.data.accessToken);
      // console.log(res.data.data.process);
      setProcess(res.data.data.process);
      var array = res.data.data.process
        ? res.data.data.process.map(
            ({ date, type, processid, status, url, systemName, ip }) => {
              return [date, type, processid, status, url, systemName, ip];
            }
          )
        : [];
      // console.log("array :: ", array);
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
    } catch (e) {
      setSerial(null);
      setProcess([]);
      setResult([]);
      console.log("ee : ", e);
    }
  };

  useEffect(() => {
    const intialSetup = async () => {
      await getData();
    };
    intialSetup();
  }, []);

  const handleSerialChange = useCallback((value) => setSerialNum(value), []);
  const handleToggle = useCallback(() => setOpen((open) => !open), []);
  const handleFeatToggle = useCallback(() =>
    setFeatureOpen((featureOpen) => !featureOpen, [])
  );
  const handleFirstEdButton = useCallback(() => {
    if (edMode) return;
    setEdMode(true);
    console.log("Educational Mode :: ", edMode);
  }, [edMode]);

  const handleSecondEdButton = useCallback(() => {
    if (!edMode) return;
    setEdMode(false);
    console.log("Educational Mode :: ", edMode);
  }, [edMode]);

  const validate = () => {
    let err = {};
    if (!serialNum) {
      err.title = "Serial Number is Required";
    } else if (serialNum % 9 != 0) {
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
    if (!edMode) {
      if (serialNum % 9 === 0) {
        // console.log({
        //   shop: shop,
        //   serialNumber: serialNum,
        // });

        try {
          axios
            .post("/api/regForm", {
              shop: shop,
              serialNumber: serialNum,
            })
            .catch((err) => {
              console.log("err: ", err);
            });
        } catch (e) {
          console.log("e ::", e);
        }
        setSerial(serialNum);
      }
    }
    setEdMode(edMode);
  };

  return (
    <Page>
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
        {serial ? null : (
          <Layout.Section id="registration form" title="Registration Form">
            <Card.Section>
              <TextContainer>
                <Heading element="p">
                  This app requires additional setup and a TCP file compiled on
                  your Tally Serial Number, Please fill up the form Below.
                </Heading>
                <a>
                  (a valid serial number starts with 7, is 9 digits long, &
                  total of digits is 9 for example 700000002, 700000011 ...
                  799999992)
                </a>
              </TextContainer>
              <Form
                onSubmit={handleSubmitSerial}
                // preventDefault={true}
                title="Registration"
                // method="POST"
              >
                <FormLayout>
                  <Card>
                    <Card.Section>
                      <Stack distribution="fill">
                        <Heading element="h1">
                          Test App in Educational Mode
                        </Heading>

                        <ButtonGroup segmented>
                          <Button
                            pressed={edMode}
                            onClick={handleFirstEdButton}
                          >
                            True
                          </Button>
                          <Button
                            pressed={!edMode}
                            onClick={handleSecondEdButton}
                          >
                            False
                          </Button>
                        </ButtonGroup>
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
                    </Card.Section>
                  </Card>
                  <Card>
                    <Card.Section>
                      <Button primary={true} fullWidth={true} submit>
                        Submit
                      </Button>
                    </Card.Section>
                  </Card>
                </FormLayout>
              </Form>
              <Card.Section>
                {/* <TextContainer>
                  <a>
                    Click on the button below and open the console to view the
                    data returned from server using authenticated api call.{" "}
                  </a>
                  <Link href={`/api2?shop=${window.shop}`}>
                    <a>Another API Demo Page</a>
                  </Link>
                  <br />
                  <Link href={`/introduction?shop=${window.shop}`}>
                    <a>Introduction</a>
                  </Link>
                  <br />
                </TextContainer> */}
              </Card.Section>
            </Card.Section>
          </Layout.Section>
        )}
      </Card>
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
            </Layout.Section>
            {serial ? (
              <>
                <Layout.Section>
                  <Stack>
                    <Stack.Item fill>
                      <Heading element="h1">Serial Number : </Heading>
                    </Stack.Item>
                    <Stack.Item>
                      <Badge status="info">{serial}</Badge>
                    </Stack.Item>
                  </Stack>
                </Layout.Section>
                <Layout.Section>
                  <Stack>
                    <Stack.Item fill>
                      <Heading element="h1">Access Token : </Heading>
                    </Stack.Item>
                    <Stack.Item>
                      <Badge status="info">{userAccessToken}</Badge>
                    </Stack.Item>
                  </Stack>
                </Layout.Section>
              </>
            ) : null}
            {product || image || orderRec || orderDel || orderRet ? (
              <>
                <Layout.Section>
                  <Heading element="h1">
                    Data Synchronised with Tally till Date
                  </Heading>
                  {product ? (
                    <>
                      <Subheading element="h3">Products Uploaded : </Subheading>
                      <p>{product}</p>
                      <br />
                    </>
                  ) : null}
                  {image ? (
                    <>
                      <Subheading element="h3">Images Uploaded : </Subheading>
                      <p>{image}</p>
                      <br />
                    </>
                  ) : null}
                  {orderRec ? (
                    <>
                      <Subheading element="h3">Orders Received : </Subheading>
                      <p>{orderRec}</p>
                      <br />
                    </>
                  ) : null}
                  {orderDel ? (
                    <>
                      <Subheading element="h3">Orders Delivered : </Subheading>
                      <p>{orderDel}</p>
                      <br />
                    </>
                  ) : null}
                  {orderRec ? (
                    <>
                      <Subheading element="h3">Orders Returned : </Subheading>
                      <p>{orderRet}</p>
                      <br />
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
            <Layout.Section>
              <Heading element="h1">Implementation Steps :</Heading>
              <ReactPlayer
                controls={true}
                url="https://www.youtube.com/embed/xKC_wnO1fFc?origin=https://tallyecomwithjwt.herokuapp.com&enablejsapi=1"
                width="100%"
                height="100%"
              />
              <br />
              <Heading element="h1">
                Map Existing Products on Shopify with Tally Prime :
              </Heading>
              <ReactPlayer
                controls={true}
                url="https://www.youtube.com/embed/3LZ-i-JOmZE?origin=https://tallyecomwithjwt.herokuapp.com&enablejsapi=1"
                width="100%"
                height="100%"
              />
              <br />
              <Heading element="h1">
                Post Stock Group in Tally Prime as Multi Variant Product on
                Shopify with Image :
              </Heading>
              <ReactPlayer
                controls={true}
                url="https://www.youtube.com/embed/P7q_7k8t3-I?origin=https://tallyecomwithjwt.herokuapp.com&enablejsapi=1"
                width="100%"
                height="100%"
              />
              <br />
              <Heading element="h1">
                Processing Orders on Shopify in Tally Prime :
              </Heading>
              <ReactPlayer
                controls={true}
                url="https://www.youtube.com/embed/uZ-DQhNqlzc?origin=https://tallyecomwithjwt.herokuapp.com&enablejsapi=1"
                width="100%"
                height="100%"
              />
              <br />
              {/* <iframe
                id="ytplayer"
                type="text/html"
                width="720"
                height="405"
                src="https://www.youtube.com/embed/9eZT2I_AOu4"
                frameborder="0"
                allowfullscreen
              /> */}
            </Layout.Section>
          </Layout>
        </Card.Section>
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
};

export default Index;
