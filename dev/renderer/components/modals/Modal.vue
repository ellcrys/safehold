<template>
  <div>
    <ConfirmCopy/>
		<ReceiveTxn />
		<SendTxn />
		<ExportKey />
		<ImportKey />
		<NewAccount />
		<SigninSuccess />
		<TxnSuccess />
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
	},

	data() {
		return {};
	},
};
</script>
