<template>
    <div class="main">
        <Header/>

        <ApplicantList/>
    </div>
</template>
<script>
import Header from "@/components/Header.vue";
import ApplicantList from "@/components/ApplicantList.vue";

export default {
    components: {
        Header,
        ApplicantList
    }
}
</script>