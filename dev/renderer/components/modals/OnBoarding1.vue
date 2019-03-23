<template>
    <transition name="fade">
        <div class="modal-overlay" id="overlay" v-if="open">
            <div class="modal-pane modal-flex">

                <div class="onboarding-main-split">

                    <div class="flex-layout">

                        <div class="flex-left split-left onboarding-1-bg">

													<!-- <img src="../../assets/img/Onboarding1.svg" /> -->

                        </div>

                        <div class="flex-right split-right">

                            <h1 class="split-right-header">Welcome to SafeHold</h1>

                            <p class="split-right-outter-article">SafeHold is a simple blockchain hub that allows you to mine the Ell coins also send and receive transaction on the Ellcrys Network. SafeHold enable non-technical users to interact with most of the features of the Ellcrys’s current Alphanet - <em>Inception v.0.1.x</em></p>

                            <div class="split-right-main">
                                <div class="article-split-wrapper">

                                    <div class="article">
                                        <div class="article-section">
                                            <h3>Mining Engine</h3>
                                            <p class="light">All operations are protected by a blockade, and this guarantees their security.</p>
                                        </div>

                                    </div>

                                    <div class="article">
                                        <div class="article-section">
                                            <h3>Wallet System</h3>
                                            <p class="light">All operations are protected by a blockade, and this guarantees their security.</p>
                                        </div>
                                    </div>

                                </div>

                                <p class="split-right-inner-article">It’s a simple platform that help both pre-sale contributors and the Ellcrys Miner Partnership Program participants to track and monitor their coin</p>

                            </div>

                            <div class="split-right-footer">
                                <button class="next">Next</button>

                                <ul class="page-switcher">
                                    <li class="active"></li>
                                    <li></li>
                                    <li></li>
                                    <li></li>
                                </ul>

                                <button class="skip">Skip</button>
                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </div>
    </transition>
</template>

<script lang="ts">
    import {
        ModalOnBoardingOpen,
        ModalOnBoardingClose
    }
    from '../constants/events';
    export default {
        data() {
                return {
                    open: false,
                };
            },
            created() {

                this.$bus.$on(ModalOnBoardingOpen, seedWords => {
                    this.open = true;
                });

                this.$bus.$on(ModalOnBoardingClose, () => {
                    this.open = false;
                });
            },
            methods: {

            },
    };
</script>