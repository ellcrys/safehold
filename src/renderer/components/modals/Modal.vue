<template>
  <div>
    <ConfirmCopy/>
    <ReceiveTxn/>
    <SendTxn/>
    <ExportKey/>
    <ImportKey/>
    <NewAccount/>
    <SigninSuccess/>
    <TxnSuccess/>
	<OnBoarding />
    <WalletOverrideWarning/>
  </div>
</template>

<script lang="ts">
import ConfirmCopy from './ConfirmCopy.vue';
import ReceiveTxn from './ReceiveTxn.vue';
import SendTxn from './SendTxn.vue';
import ExportKey from './ExportKey.vue';
import ImportKey from './ImportKey.vue';
import NewAccount from './NewAccount.vue';
import SigninSuccess from './SigninSuccess.vue';
import TxnSuccess from './TxnSuccess.vue';
import OnBoarding from './OnBoarding.vue';
import WalletOverrideWarning from './WalletOverrideWarning.vue';

export default {
	components: {
		ConfirmCopy,
		ReceiveTxn,
		SendTxn,
		ExportKey,
		ImportKey,
		NewAccount,
		SigninSuccess,
		TxnSuccess,
		OnBoarding,
		WalletOverrideWarning,
	},

	data() {
		return {};
	},
};
</script>
