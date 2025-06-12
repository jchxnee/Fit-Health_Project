import React from "react";
import styled from "styled-components";
import RegionSelect from "../RegionSelect.jsx";

const Section = styled.section`
    width: 100%;
    padding: 0 12px;
`;

const Row = styled.div`
    display: flex;
    align-items: center;
    gap: 120px;
    justify-content: center;
    @media (max-width: 200px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }
`;

const Label = styled.div`
    font-weight: 600;
    font-size: 18px;
    color: #222;
    width: 90px;
`;

function RegionSection() {
    return (
        <Section>
            <Row>
                <Label>희망지역</Label>
                <RegionSelect className="Select" />
            </Row>
        </Section>
    );
}

export default RegionSection;
