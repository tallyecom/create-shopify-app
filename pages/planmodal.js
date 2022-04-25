import React, { useCallback, useState } from 'react';
import { Button, ChoiceList, Modal, Stack, TextContainer, Heading, Popover, ActionList } from '@shopify/polaris';

export default function PlanModal(props) {
    // console.log(props)
    const title = props.planDetail.title
    const [active, setActive] = useState(false);
    const [selected, setSelected] = useState([])
    const [month, setMonth] = useState(title == 'Free')
    const [year, setYear] = useState(title == 'Order Based Plan' || title == 'Periodic Plan')
    // if (title == 'Periodic Plan') setSelected('Annually')
    const handleSelectionChange = useCallback((value) => {
        // console.log("handleSelectionChange", value);
        setSelected(value)
        setMonth(value == "Monthly")
        setYear(value == "Annually")
    }, []);
    const handleModalChange = useCallback(() => { setActive(!active) }, [active]);

    const handleCancel = () => {
        handleModalChange();
    }
    // console.log(props.planDetail);
    const handleAcceptPlanChange = () => {
        console.log("month :: ", month, " year :: ", year)
        let orli, prli, imli
        console.log("Plan Name :: ", props.planDetail.title)
        if (props.planDetail.title != "Periodic Plan") {
            console.log(props.planDetail.numOrders, props.orderRecLimit, props.planDetail.numProducts, props.productLimit, props.planDetail.numImages, props.imageLimit)
            orli = props.orderRecLimit
            prli = props.productLimit
            imli = props.imageLimit
            orli = orli + props.planDetail.numOrders
            prli = prli + props.planDetail.numProducts
            imli = imli + props.planDetail.numImages
            console.log('limits :: ', orli, orli, imli)
        } else {
            orli = props.planDetail.numOrders
            prli = props.planDetail.numProducts
            imli = props.planDetail.numImages
        }
        props.handlePlanChange(props.planDetail.objID, month, year, orli, orli, imli)
    };

    let result
    { title.includes('Plan') ? result = `${title}` : result = `${title} Plan` }

    const activator = <Button
        fullWidth
        primary
        size="medium"
        disabled={false}
        onClick={handleModalChange}>
        {title.includes('Plan')
            ? `Select ${title}`
            : `Select ${title} Plan`
        }
    </Button>;

    return (
        <div>
            <Modal
                activator={activator}
                open={active}
                onClose={handleCancel}
                title={result}
                primaryAction={{
                    content: 'Save',
                    onAction: handleAcceptPlanChange,
                    disabled: selected == ""
                }}
                secondaryActions={
                    [
                        {
                            content: 'Cancel',
                            onAction: handleCancel,
                        },
                    ]}
            >
                <Modal.Section>
                    <Stack.Item>
                        <Heading element="h1">You've selected {result}, Please Confirm below & you'll be entitled to following benefits.</Heading>
                        <Stack>
                            <Stack.Item fill>Period :</Stack.Item>
                            <Stack.Item><Heading element="h3">{month ? '1 Month' : '1 Year'}</Heading></Stack.Item>
                            {/* <Stack.Item><Heading element="h3">{year ? '1 Year' : null}</Heading></Stack.Item> */}
                        </Stack>
                        <Stack>
                            <Stack.Item fill>Orders :</Stack.Item>
                            <Stack.Item><Heading element="h3">{props.planDetail.numOrders == null ? 'Unlimited' : props.planDetail.numOrders}</Heading></Stack.Item>
                        </Stack>
                        <Stack>
                            <Stack.Item fill>Products :</Stack.Item>
                            <Stack.Item><Heading element="h3">{props.planDetail.numProducts == null ? 'Unlimited' : props.planDetail.numProducts}</Heading></Stack.Item>
                        </Stack>
                        <Stack>
                            <Stack.Item fill>Images :</Stack.Item>
                            <Stack.Item><Heading element="h3">{props.planDetail.numImages == null ? 'Unlimited' : props.planDetail.numImages}</Heading></Stack.Item>
                        </Stack>
                        {props.icCharged
                            ? null
                            : <>
                                <Stack>
                                    <Stack.Item fill>Installation Charge :</Stack.Item>
                                    <Stack.Item>
                                        <Heading element="h3">
                                            ${props.planDetail.installationCharge.toFixed(2)}
                                        </Heading>
                                    </Stack.Item>
                                </Stack>
                            </>
                        }
                        {title == 'Periodic Plan'
                            ?
                            <>
                                {month
                                    ? <>
                                        <Stack>
                                            <Stack.Item fill>Plan Activation Charge Per Month </Stack.Item>
                                            <Stack.Item fill>(${props.planDetail.monthlyPrice * 12}.00 / Year)</Stack.Item>
                                            <Stack.Item>
                                                <Heading element="h3">
                                                    ${props.planDetail.monthlyPrice}.00 / Month
                                                </Heading>
                                            </Stack.Item>
                                        </Stack>
                                        <Stack>
                                            <Stack.Item fill></Stack.Item>
                                            <Stack.Item></Stack.Item>
                                        </Stack>
                                    </>
                                    : null
                                }
                                {year
                                    ? <>
                                        <Stack>
                                            <Stack.Item fill>Plan Activation Charge Per Year</Stack.Item>
                                            <Stack.Item fill>(${props.planDetail.annualPriceA} / Month)</Stack.Item>
                                            <Stack.Item>
                                                <Heading element="h3">
                                                    ${props.planDetail.annualPriceB}.00 / Year
                                                </Heading>
                                            </Stack.Item>
                                        </Stack>
                                    </>
                                    : null
                                }
                            </>
                            : null
                        }
                        {props.planDetail.orderPrice != 0
                            ? <>
                                <Stack>
                                    <Stack.Item fill>Plan Activation Charge</Stack.Item>
                                    <Stack.Item>
                                        <Heading element="h3">
                                            ${props.planDetail.orderPrice}.00
                                        </Heading>
                                    </Stack.Item>
                                </Stack>
                            </>
                            : null
                        }
                        {props.planDetail.productPrice != 0
                            ? <>
                                <Stack>
                                    <Stack.Item fill>Plan Activation Charge</Stack.Item>
                                    <Stack.Item>
                                        <Heading element="h3">
                                            ${props.planDetail.productPrice.toFixed(2)}
                                        </Heading>
                                    </Stack.Item>
                                </Stack>
                            </>
                            : null
                        }
                        {props.planDetail.monthlyPrice > 0
                            ? <>
                                <Stack vertical>
                                    <Stack.Item>
                                        <ChoiceList
                                            title="Select Period"
                                            choices={[
                                                { label: 'Monthly', value: 'Monthly' },
                                                { label: "Annually", value: 'Annually' }

                                            ]}
                                            selected={selected}
                                            onChange={handleSelectionChange}
                                        />
                                    </Stack.Item>
                                </Stack>
                            </>
                            : null
                        }
                        {/* {title == "Free" ? setSelected(['Monthly']) : null} */}
                        {title == "Free"
                            ? <>
                                <Stack vertical>
                                    <Stack.Item>
                                        <ChoiceList
                                            title="Select Period"
                                            choices={[
                                                { label: 'Monthly', value: 'Monthly' },
                                            ]}
                                            selected={selected}
                                            onChange={handleSelectionChange}
                                        />
                                    </Stack.Item>
                                </Stack>
                            </>
                            : null
                        }
                        {/* {title == "Order Based Plan" ? setSelected(['Annually']) : null} */}
                        {title == "Order Based Plan"
                            ? <>
                                <Stack vertical>
                                    <Stack.Item>
                                        <ChoiceList
                                            title="Select Period"
                                            choices={[
                                                { label: "Annually", value: 'Annually' }
                                            ]}
                                            selected={selected}
                                            onChange={handleSelectionChange}
                                        />
                                    </Stack.Item>
                                </Stack>
                            </>
                            : null
                        }
                    </Stack.Item>
                </Modal.Section>
            </Modal>
        </div>
    );
}
