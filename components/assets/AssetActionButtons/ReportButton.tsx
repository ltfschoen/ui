import {
  CategoricalAssetId,
  getIndexOf,
  IndexerContext,
  isRpcSdk,
  Market,
  ScalarAssetId,
} from "@zeitgeistpm/sdk-next";
import ScalarReportBox from "components/outcomes/ScalarReportBox";
import { useSdkv2 } from "lib/hooks/useSdkv2";
import { useModalStore } from "lib/stores/ModalStore";
import { useNotificationStore } from "lib/stores/NotificationStore";
import { useStore } from "lib/stores/Store";
import { extrinsicCallback, signAndSend } from "lib/util/tx";
import { observer } from "mobx-react";

const ReportButton = observer(
  ({
    market,
    assetId,
  }: {
    market: Market<IndexerContext>;
    assetId: ScalarAssetId | CategoricalAssetId;
  }) => {
    const [sdk] = useSdkv2();
    const store = useStore();
    const { wallets } = store;
    const notificationStore = useNotificationStore();
    const modalStore = useModalStore();

    if (!market) return null;

    const ticker = market.categories?.[getIndexOf(assetId)].ticker;

    const reportDisabled = !sdk || !isRpcSdk(sdk);

    const handleClick = async () => {
      if (!isRpcSdk(sdk)) return;

      if (market.marketType.scalar) {
        modalStore.openModal(
          <div>
            <ScalarReportBox market={market} />
          </div>,
          "Report outcome",
        );
      } else {
        //@ts-ignore
        const ID = assetId.CategoricalOutcome[1];
        const signer = wallets.getActiveSigner();

        const callback = extrinsicCallback({
          notificationStore,
          successCallback: async () => {
            notificationStore.pushNotification(
              `Reported market outcome: ${ticker}`,
              {
                type: "Success",
              },
            );
          },
          failCallback: ({ index, error }) => {
            notificationStore.pushNotification(
              store.getTransactionError(index, error),
              {
                type: "Error",
              },
            );
          },
        });

        if (isRpcSdk(sdk)) {
          const tx = sdk.api.tx.predictionMarkets.report(market.marketId, {
            Categorical: ID,
          });
          signAndSend(tx, signer, callback);
        }
      }
    };

    return (
      <button
        onClick={handleClick}
        disabled={reportDisabled}
        className="text-blue-600 font-bold"
      >
        Report Outcome
      </button>
    );
  },
);

export default ReportButton;
