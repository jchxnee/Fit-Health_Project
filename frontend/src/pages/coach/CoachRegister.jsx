import Header from '../../components/Header.jsx';
import Footer from '../../components/Footer.jsx';
import FieldSection from '../../components/CoachRegister/FieldSection.jsx';
import RegionSection from '../../components/CoachRegister/RegionSection.jsx';
import IdSection from '../../components/CoachRegister/IdSection.jsx';
import PriceDiscountSection from '../../components/CoachRegister/PriceDiscountSection.jsx';
import IntroSection from '../../components/CoachRegister/IntroSection.jsx';
import PhotoSection from '../../components/CoachRegister/PhotoSection.jsx';
import CareerSection from '../../components/CoachRegister/CareerSection.jsx';
import AgreementSection from '../../components/CoachRegister/AgreementSection.jsx';
import SubmitSection from '../../components/CoachRegister/SubmitSection.jsx';
import TitleBar from '../../components/TitleBar.jsx';
import styled from 'styled-components';

const MainContainer = styled.section`
  max-width: 1008px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 80px;

  button {
    outline: none;
  }
`;

function CoachRegister() {
  return (
    <>
      <MainContainer>
        <TitleBar title="핏코치 등록" />
        <FieldSection />
        <RegionSection />
        <IdSection />
        <PriceDiscountSection />
        <IntroSection />
        <PhotoSection />
        <CareerSection />
        <AgreementSection />
        <SubmitSection />
      </MainContainer>
    </>
  );
}

export default CoachRegister;
