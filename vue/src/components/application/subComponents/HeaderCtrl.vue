<template>
  <div>
    <b-row align-h="end">
      <b-nav-item @click="$page.GoToPage('/docs/Promotions')"> {{$t('Header.Promotions')}} </b-nav-item>
      <b-nav-item-dropdown right>
        <template #button-content> {{$t('Header.Feeback')}} </template>
        <b-dropdown-item
          v-for="(item, index) in Feedback_list"
          :key="index"
          @click="$page.GoToPage(`${item.path}`)"
        >
          <icon :icon="item.icon" class="fa-lg" />
          <span class="drop_text">
            {{ $t(item.text) }}
          </span>
        </b-dropdown-item>
      </b-nav-item-dropdown>
      <b-nav-item-dropdown right>
        <template #button-content> {{$t('Header.CustomerServices')}} </template>
        <b-dropdown-group :header="$t('Header.BecomeAnExpert')">
          <b-dropdown-item-button
            v-for="(item, index) in Customer_Expert"
            :key="index"
            @click="$page.GoToPage(`${item.path}`)"
          >
            <icon :icon="item.icon" class="fa-lg" />
            <span class="drop_text">
              {{ $t(item.text) }}
            </span>
          </b-dropdown-item-button>
        </b-dropdown-group>
        <b-dropdown-divider />
        <b-dropdown-group :header="$t('Header.BecomeASubscriber')">
          <b-dropdown-item-button
            v-for="(item, index) in Customer_Subscriber"
            :key="index"
            @click="$page.GoToPage(`${item.path}`)"
          >
            <icon :icon="item.icon" class="fa-lg" />
            <span class="drop_text">
              {{ $t(item.text) }}
            </span>
          </b-dropdown-item-button>
        </b-dropdown-group>
        <b-dropdown-divider />
        <b-dropdown-group :header="$t('Header.HelpCenter')">
          <b-dropdown-item-button
            v-for="(item, index) in Customer_Help"
            :key="index"
            @click="$page.GoToPage(`${item.path}`)"
          >
            <icon :icon="item.icon" class="fa-lg" />
            <span class="drop_text">
              {{ $t(item.text) }}
            </span>
          </b-dropdown-item-button>
        </b-dropdown-group>
        <b-dropdown-divider />
        <b-dropdown-group :header="$t('Header.ContactSupport')">
          <b-dropdown-item-button
            v-for="(item, index) in Customer_Support"
            :key="index"
            @click="$page.GoToPage(`${item.path}`)"
          >
            <icon :icon="item.icon" class="fa-lg" />
            <span class="drop_text">
              {{ $t(item.text) }}
            </span>
          </b-dropdown-item-button>
        </b-dropdown-group>
        <b-dropdown-divider />
        <b-dropdown-group :header="$t('Header.PolicyAgreement')">
          <b-dropdown-item-button
            v-for="(item, index) in Customer_Policy"
            :key="index"
            @click="$page.GoToPage(`${item.path}`)"
          >
            <icon :icon="item.icon" class="fa-lg" />
            <span class="drop_text">
              {{ $t(item.text) }}
            </span>
          </b-dropdown-item-button>
        </b-dropdown-group>
      </b-nav-item-dropdown>
      <Language />
    </b-row>
  </div>
</template>

<style lang="scss" scoped>
.row {
  height: 35px;
  font-size: 0.85rem;
}
</style>

<script>
import { mapState } from "vuex";
import Customer from "@/config/components/GlobalHeader";

export default {
  computed: {
    Customer_Expert() {
      return Customer.Header_CustomerExpert();
    },
    Customer_Subscriber() {
      return Customer.Header_CustomerSubscriber();
    },
    Customer_Help() {
      return Customer.Header_CustomerHelp();
    },
    Customer_Support() {
      return Customer.Header_CustomerSupport();
    },
    Customer_Policy() {
      return Customer.Header_CustomerPolicy();
    },
    Feedback_list() {
      return Customer.Feedback_list();
    },
  },
};
</script>