<script setup lang="ts">

const props = defineProps < {
    showForm: boolean;
} > ();
</script>


<template>
    <form v-if="props.showForm" class="d-flex flex-column flex-grow-1 justify-space-between">
        <div>
            <v-select label="شماره سفارش"></v-select>
            <v-textarea label="متن پیام" row-height="30" rows="4" variant="filled" auto-grow shaped></v-textarea>
            <v-file-input accept="image/png, image/jpeg, image/bmp" label="آپلود تصویر"
                placeholder="Pick an avatar"></v-file-input>
        </div>
        <div>
            <v-btn block rounded="pill" color="primary" size="x-large" class="me-4"> ثبت درخواست </v-btn>
        </div>
    </form>
</template>
