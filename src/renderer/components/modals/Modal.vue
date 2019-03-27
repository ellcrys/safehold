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
<<<<<<< HEAD
import OnBoarding from './OnBoarding.vue';
=======
import WalletOverrideWarning from './WalletOverrideWarning.vue';
>>>>>>> 017d960c7932a72aa77a34f7b59dc5d90a1c8406

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
<<<<<<< HEAD
		OnBoarding,
=======
		WalletOverrideWarning,
>>>>>>> 017d960c7932a72aa77a34f7b59dc5d90a1c8406
	},

	data() {
		return {};
	},
};
</script>
