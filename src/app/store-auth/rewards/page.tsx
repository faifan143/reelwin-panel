import StoreRewardsPage from '@/components/stores-offers/StoreRewardsPage';
import StoreRouteGuard from '@/components/stores-offers/StoreRouteGuard';


export default function StoreRewards() {
  return (
    <StoreRouteGuard>
      <StoreRewardsPage />
    </StoreRouteGuard>
  );
}
