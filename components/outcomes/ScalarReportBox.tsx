import {
  getScalarBounds,
  IndexerContext,
  isRpcSdk,
  Market,
} from "@zeitgeistpm/sdk-next";
import { AmountInput } from "components/ui/inputs";
import TransactionButton from "components/ui/TransactionButton";
import Decimal from "decimal.js";
import { ZTG } from "lib/constants";
import { useSdkv2 } from "lib/hooks/useSdkv2";
import { useNotificationStore } from "lib/stores/NotificationStore";
import { useStore } from "lib/stores/Store";
import { extrinsicCallback, signAndSend } from "lib/util/tx";
import { observer } from "mobx-react";
import { useState } from "react";

const ScalarReportBox = observer(
  ({
    market,
    onReport,
  }: {
    market: Market<IndexerContext>;
    onReport?: () => void;
  }) => {
    const [sdk] = useSdkv2();
    const store = useStore();
    const { wallets } = store;
    const notificationStore = useNotificationStore();
    const [scalarReportValue, setScalarReportValue] = useState("");

    if (!market) return null;

    const bounds = getScalarBounds(market).unwrap();

    const handleNumberChange = (val: string) => {
      setScalarReportValue(val);
    };

    const reportDisabled = !sdk || !isRpcSdk(sdk);

    const handleSignTransaction = async () => {
      const outcomeReport: any = {
        scalar: new Decimal(scalarReportValue).mul(ZTG).toFixed(0),
      };
      const signer = wallets.getActiveSigner();

      const callback = extrinsicCallback({
        notificationStore,
        successCallback: async () => {
          notificationStore.pushNotification("Outcome Reported", {
            type: "Success",
          });
          onReport?.();
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
        const tx = sdk.api.tx.predictionMarkets.report(
          market.marketId,
          outcomeReport,
        );
        signAndSend(tx, signer, callback);
      }
    };

    return (
      <>
        <AmountInput
          value={scalarReportValue}
          min={bounds[0].toString()}
          max={bounds[1].toString()}
          onChange={handleNumberChange}
          showErrorMessage={false}
        />
        <TransactionButton
          className="my-ztg-10 shadow-ztg-2"
          onClick={handleSignTransaction}
          disabled={reportDisabled}
        >
          Report Outcome
        </TransactionButton>
      </>
    );
  },
);

export default ScalarReportBox;
