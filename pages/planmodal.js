import React, { useCallback, useState } from 'react';
import { Button, ChoiceList, Modal, Stack, TextContainer, Heading, Popover, ActionList } from '@shopify/polaris';


export default function PlanModal(props) {
    // console.log(props)
    const [active, setActive] = useState(false);
    const [selected, setSelected] = useState([])
    const [month, setMonth] = useState(false)
    const [year, setYear] = useState(false)

    const handleSelectionChange = useCallback((value) => {
        console.log("handleSelectionChange", value);
        setSelected(value)
        setMonth(value == "Monthly")
        setYear(value == "Annually")
    }, []);

    const handleModalChange = useCallback(() => { setActive(!active) }, [active]);

    const handleCancel = () => {
        handleModalChange();
    }
    // console.log(props.planDetail.title);
    const handleAcceptPlanChange = () => {
        // console.log(selected[0]);
        // console.log("selected :: ", selected[0], " Monthly :: ", month, " Yearly ::", year)
        props.handlePlanChange(props.planDetail, month, year)

    };

    let result
    { props.planDetail.title.includes('Plan') ? result = `Select ${props.planDetail.title}` : result = `Select ${props.planDetail.title} Plan` }

    const activator = <Button
        fullWidth
        primary
        size="medium"
        disabled={false}
        onClick={handleModalChange}>
        {props.planDetail.title.includes('Plan')
            ? `Select ${props.planDetail.title}`
            : `Select ${props.planDetail.title} Plan`
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
                        <Heading element="h1">`You've selected ${props.planDetail.title}, Please Confirm your Choice & you'll be entitled to following benefits.`</Heading>
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
                        <Stack>
                            <Stack.Item fill>Installation Charge :</Stack.Item>
                            <Stack.Item>
                                <Heading element="h3">
                                    ${props.planDetail.installationCharge.toFixed(2)}
                                </Heading>
                            </Stack.Item>
                        </Stack>
                        {props.planDetail.monthlyPrice > 0
                            ? <>
                                <Stack>
                                    <Stack.Item fill>Period :</Stack.Item>
                                    <Stack.Item><Heading element="h3">1 month</Heading></Stack.Item>
                                </Stack>
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
                            : null}
                    </Stack.Item>
                </Modal.Section>
            </Modal>
        </div>
    );
}
