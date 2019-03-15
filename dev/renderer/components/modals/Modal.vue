<template>
  <div>
    <ConfirmCopy/>
		<ReceiveTxn />
		<SendTxn />
  </div>
</template>

<script lang="ts">
import ConfirmCopy from './ConfirmCopy.vue';
import ReceiveTxn from './ReceiveTxn.vue';
import SendTxn from './SendTxn.vue';

export default {
	components: {
		ConfirmCopy,
		ReceiveTxn,
		SendTxn,
	},

	data() {
		return {};
	},
};
</script>
