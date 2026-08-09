import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
  IonBadge
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { shirtOutline, chatbubblesOutline, personOutline, cartOutline } from 'ionicons/icons';
import Feed from './pages/Feed';
import Inbox from './pages/Inbox';
import Profile from './pages/Profile';
import ProductDetail from './pages/ProductDetail';
import AddProduct from './pages/AddProduct';
import Checkout from './pages/Checkout';
import { CartProvider, useCart } from './contexts/CartContext';
import { FavoritesProvider } from './contexts/FavoritesContext';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const AppContent: React.FC = () => {
  const { totalItemsCount } = useCart();

  return (
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/feed">
            <Feed />
          </Route>
          <Route exact path="/inbox">
            <Inbox />
          </Route>
          <Route exact path="/profile">
            <Profile />
          </Route>
          <Route exact path="/product/:id">
            <ProductDetail />
          </Route>
          <Route exact path="/add-product">
            <AddProduct />
          </Route>
          <Route exact path="/checkout">
            <Checkout />
          </Route>
          <Route exact path="/cart">
            <Checkout />
          </Route>
          <Route exact path="/">
            <Redirect to="/feed" />
          </Route>
        </IonRouterOutlet>
        
        <IonTabBar slot="bottom">
          <IonTabButton tab="feed" href="/feed">
            <IonIcon aria-hidden="true" icon={shirtOutline} />
            <IonLabel>Comprar</IonLabel>
          </IonTabButton>
          <IonTabButton tab="inbox" href="/inbox">
            <IonIcon aria-hidden="true" icon={chatbubblesOutline} />
            <IonLabel>Mensajes</IonLabel>
          </IonTabButton>
          <IonTabButton tab="checkout" href="/checkout">
            <IonIcon aria-hidden="true" icon={cartOutline} />
            <IonLabel>Carrito</IonLabel>
            {totalItemsCount > 0 && (
              <IonBadge color="danger" mode="ios">{totalItemsCount}</IonBadge>
            )}
          </IonTabButton>
          <IonTabButton tab="profile" href="/profile">
            <IonIcon aria-hidden="true" icon={personOutline} />
            <IonLabel>Perfil</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  );
};

const App: React.FC = () => (
  <IonApp>
    <CartProvider>
      <FavoritesProvider>
        <AppContent />
      </FavoritesProvider>
    </CartProvider>
  </IonApp>
);

export default App;
