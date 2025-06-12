import React from "react";
import styled from "styled-components";
import {FaCheckSquare} from "react-icons/fa";

const Section = styled.section`
  width: 100%;
`;
const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
    
    .logo{
        width: 24px;
        height: 24px;
        color: #22c55e;
    }
`;
const AgreeLabel = styled.label`
  color: #22c55e;
  font-weight: 600;
  font-size: 18px;
`;
const Notice = styled.div`
  color: #888;
  font-size: 15px;
  line-height: 1.7;
  text-align: left;
`;

function AgreementSection() {
  return (
    <Section>
      <Row>
        <FaCheckSquare  className="logo"/>
        <AgreeLabel htmlFor="agree">
          트레이너 등록 전 반드시 확인해주세요!
        </AgreeLabel>
      </Row>
      <Notice>
        트레이너로 등록 시, 고객으로부터 직접 결제를 받게 됩니다.<br />
        따라서 전문성 없는 허위 등록, 무단 이탈, 무책임한 대응 등으로 고객에게 피해를 줄 경우,<br />
        회사는 피해 금액의 최대 10배에 해당하는 금액을 배상 청구할 수 있으며, 법적 조치를 취할 수 있습니다.<br /><br />
        • 등록 시 본인의 실제로 트레이닝이 가능한 전문가임을 확인해주세요.<br />
        • 고객 신뢰를 기반으로 운영되는 시스템입니다. 신중히 등록 바랍니다.<br />
        • 트레이너 등록 후에는 고객과의 약속(시간, 장소 등)을 반드시 지켜야 하며, 반복된 불이행 시 서비스 이용이 제한됩니다.<br />
        • 고객과의 금전 거래 및 세부 일정은 플랫폼을 통해 투명하게 관리되며, 외부 거래 적발 시 업체 및 민형사상 책임을 물을 수 있습니다.
      </Notice>
    </Section>
  );
}

export default AgreementSection; 