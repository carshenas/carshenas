<script setup lang="ts">
import { ref, onMounted } from "vue";
import { updateFeedback } from "@/services/carshenas/feedback";
import { useUserStore } from "@/stores/user";

const props = defineProps<{
  comments: { user: string; score: number; date: string; comment: string }[];
  id: number;
}>();

const emit = defineEmits(["feedbackSubmitted"]);

const rating = ref(0);
const showForm = ref(false);
const hasCommented = ref(false);

// Check if user has already commented
const checkUserComment = () => {
  const userStore = useUserStore();
  const currentUser = userStore.user;

  if (currentUser && props.comments) {
    // Check if any comment has the current user's name
    hasCommented.value = props.comments.some(comment =>
      comment.user === `${currentUser.firstName} ${currentUser.lastName}`
    );
  }
};

onMounted(() => {
  checkUserComment();
});

const toggleForm = () => {
  if (hasCommented.value) {
    return; // Don't show form if user has already commented
  }
  showForm.value = !showForm.value;
};
const comment = ref("");

const rules = {
  required: (value: string) => !!value || "این فیلد اجباری است",
};

const handleSubmit = async () => {
  if (!comment.value || rating.value === null) {
    return;
  }

  const feedback = {
    score: rating.value,
    comment: comment.value,
  };

  try {
    const productId = props.id;
    await updateFeedback(productId, feedback);
    comment.value = "";
    rating.value = 0;
    emit("feedbackSubmitted");
    toggleForm();
  } catch (error) {
    console.error("Error submitting feedback:", error);
  }
};
</script>

<template>
  <div id="comments" class="d-flex flex-column pa-4 ga-4">
    <div class="d-flex align-center">
      <h4 role="heading" class="text-no-wrap">{{ $t("product.comments") }}</h4>
      <div class="w-100 border h-0 mx-2"></div>
      <v-btn v-if="!hasCommented" variant="text" @click="toggleForm">{{
        $t("product.newComment")
      }}</v-btn>
      <span v-else class="text-caption text-grey">شما قبلاً نظر خود را ثبت کرده‌اید</span>
    </div>

    <v-form v-if="showForm" @submit.prevent="handleSubmit">
      <v-textarea v-model="comment" label="متن پیام" color="primary" rows="2" variant="outlined" auto-grow
        :rules="[rules.required]">
      </v-textarea>
      <div class="d-flex justify-space-between">
        <v-rating v-model="rating" density="compact" color="orange-lighten-1" size="small"></v-rating>

        <v-btn color="primary" @click="handleSubmit"> ثبت </v-btn>
      </div>
    </v-form>
    <div v-if="props.comments">
      <div class="d-flex flex-column border rounded-lg pa-2 ga-4" v-for="(comment, id) in props.comments" :key="id">
        <div class="d-flex align-center">
          <v-avatar size="54">
            <v-icon icon="account_circle" size="48"></v-icon>
          </v-avatar>
          <div class="d-flex flex-column w-100">
            <div class="d-flex justify-space-between">
              <span>{{ comment.user }}</span>

              <span>{{ comment.date }}</span>
            </div>
            <v-rating v-if="comment.score !== 0" disabled color="orange-lighten-1" density="compact"
              v-model="comment.score"></v-rating>
          </div>
        </div>
        <p>{{ comment.comment }}</p>
      </div>
    </div>
    <div v-else>
      نظری ثبت نشده
    </div>
  </div>
</template>
