import './ExploreContainer.css';
import { IonAlert, IonButton } from '@ionic/react';




interface ContainerProps {
  name: string;
}

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
  return (
    <div className="container">
      <>
      <IonButton id="present-alert">Clickea</IonButton>
      <IonAlert
        trigger="present-alert"
        header="A Short Title Is Best"
        subHeader="A Sub Header Is Optional"
        message="A message should be a short, complete sentence."
        buttons={['Action']}
      ></IonAlert>
      </>
    </div>
  );
};

export default ExploreContainer;
