<script setup lang="ts">
import type { VForm } from "vuetify/components";
import { ref } from "vue";
import { createTicketService } from "@/services/carshenas/support";

const formRef = ref<VForm | null>(null);
const isLoading = ref(false);
const rules = {
  required: (value: string) => !!value || "",
};
const files = ref<File[]>([]);
const message = ref("");

const emit = defineEmits<{
  (event: "update:isFormVisible", value: boolean): void;
}>();

const handleSubmit = async () => {
  const { valid: isValid } = await formRef.value!.validate();
  if (isValid) {
    const formData = new FormData(); // Create a new FormData object
    formData.append("message", message.value);
    if (files.value.length > 0) {
      for (const file of files.value) {
        formData.append("files[]", file); // Append each file with key 'files[]'
      }
    }
    try {
      isLoading.value = true;
      await createTicketService(formData);
      emit("update:isFormVisible", false); // Hide the form upon successful submission
    } catch (error) {
      console.error("Form submission failed:", error);
    } finally {
      isLoading.value = false;
    }
  } else {
    console.log("Form validation failed");
  }
};

const props = defineProps<{
  isFormVisible: boolean;
}>();
</script>

<template>
  <v-form
    ref="formRef"
    v-if="props.isFormVisible"
    class="d-flex flex-column justify-space-between"
  >
    <div>
      <v-textarea
        v-model="message"
        :label="$t('support.textLabel')"
        row-height="30"
        rows="4"
        variant="filled"
        auto-grow
        shaped
        :rules="[rules.required]"
        class="support-input"
      ></v-textarea>
    </div>
    <div>
      <v-file-input
        v-model="files"
        :label="$t('support.fileLabel')"
        placeholder="Upload your documents"
        multiple
      >
        <template v-slot:selection="{ fileNames }">
          <template v-for="fileName in fileNames" :key="fileName">
            <v-chip class="me-2" color="primary" size="small" label>
              {{ fileName }}
            </v-chip>
          </template>
        </template>
      </v-file-input>
    </div>
    <div>
      <v-btn
        block
        rounded="pill"
        color="primary"
        size="x-large"
        class="me-4"
        @click="handleSubmit"
      >
        {{ $t("shared.submit") }}
      </v-btn>
    </div>
  </v-form>
</template>
<style scoped>
.justify-start {
  justify-content: flex-start;
}

.justify-end {
  justify-content: flex-end;
}

textarea {
  padding-top: 2rem !important;
}
</style>
