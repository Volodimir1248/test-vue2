<template>
  <section class="applicant_list">
      <div class="header">
          <h1>
              Список заявлений
          </h1>
      </div>
      <div class="search">
          <input class="search_input" type="text" v-model="search_text">
      </div>
      <div class="resp_table">
          <div class="sorting" :class="{active: sorting_active}">
              <div
                  class="select"
                  :class="filter_type !== '' ? 'active' : ''"
                  @click="sorting_active = !sorting_active"
              >
                  <span class="placeholder">
                      Сортировать по
                  </span>
                  <span class="value">
                      {{ sorting_name }}
                  </span>
              </div>
              <ul class="list">
                  <li
                      v-for="(item,key) in drop_down_list"
                      :key="key"
                      class="item"
                      @click="choose_filter_type(item.id)"
                  >
                      {{ item.label }}
                  </li>
              </ul>

              <div class="buttons">
                  <button
                      class="button up"
                      :class="{active: filter_asc === 'desc'}"
                      @click="filter_asc = 'desc'"
                  />
                  <button
                      class="button down"
                      :class="{active: filter_asc === 'asc' }"
                      @click="filter_asc = 'asc'"
                  />
              </div>
          </div>
          <table>
              <thead>
                  <tr>
                      <th class="name" scope="col" @click="change_filter('name')">
                          ФИО
                          <i class="icon" :class="{'active': filter_type === 'name', 'bottom' : filter_asc === 'asc', 'top' : filter_asc === 'desc'}"></i>
                      </th>
                      <th class="date" scope="col" @click="change_filter('date')">
                          Дата подачи заявления
                          <i class="icon" :class="{'active': filter_type === 'date', 'bottom' : filter_asc === 'asc', 'top' : filter_asc === 'desc'}"></i>
                      </th>
                      <th class="rus" scope="col" @click="change_filter('rus')">
                          Балл по русскому
                          <i class="icon" :class="{'active': filter_type === 'rus', 'bottom' : filter_asc === 'asc', 'top' : filter_asc === 'desc'}"></i>
                      </th>
                      <th class="math" scope="col" @click="change_filter('math')">
                          Балл по математике
                          <i class="icon" :class="{'active': filter_type === 'math', 'bottom' : filter_asc === 'asc', 'top' : filter_asc === 'desc'}"></i>
                      </th>
                      <th class="info" scope="col" @click="change_filter('info')">
                          Балл по информатике
                          <i class="icon" :class="{'active': filter_type === 'info', 'bottom' : filter_asc === 'asc', 'top' : filter_asc === 'desc'}"></i>
                      </th>
                      <th class="sum" scope="col" @click="change_filter('sum')">
                          Суммарный балл
                          <i class="icon" :class="{'active': filter_type === 'sum', 'bottom' : filter_asc === 'asc', 'top' : filter_asc === 'desc'}"></i>
                      </th>
                      <th class="percent" scope="col" @click="change_filter('percent')">
                          Процент
                          <i class="icon" :class="{'active': filter_type === 'percent', 'bottom' : filter_asc === 'asc', 'top' : filter_asc === 'desc'}"></i>
                      </th>
                  </tr>
              </thead>
              <tbody>
                  <tr
                      v-for="(applicant,key) in applicant_list"
                      :key="key"
                      class="applicant"
                  >
                      <td class="name" data-label="ФИО" >
                          <span>{{ applicant.name }}</span>
                      </td>
                      <td class="date" data-label="Дата подачи заявления" >
                          <span>{{ applicant.date }}</span>
                      </td>
                      <td class="rus" data-label="Балл по русскому" :class="percent_color(applicant.rus / 5 * 100)">
                          <span>{{ applicant.rus }}</span>
                      </td>
                      <td class="math" data-label="Балл по математике" :class="percent_color(applicant.math / 5 * 100)">
                          <span>{{ applicant.math }}</span>
                      </td>
                      <td class="info" data-label="Балл по информатике" :class="percent_color(applicant.info / 5 * 100)">
                          <span>{{ applicant.info }}</span>
                      </td>
                      <td class="sum" data-label="Суммарный балл" :class="percent_color(applicant.sum / 15 * 100)">
                          <span>{{ applicant.sum }}</span>
                      </td>
                      <td class="percent" data-label="Процент" >
                          <div class="pie_wrap">
                              <div class="pie" :style="style_percent(applicant.percent)">
                                  {{ applicant.percent }}%
                              </div>
                          </div>
                          <div class="line_wrap">
                              <span class="value">{{ applicant.percent }}%</span>
                              <span class="line" :style="style_percent(applicant.percent)"/>
                          </div>
                      </td>
                  </tr>
              </tbody>
          </table>
      </div>
  </section>

</template>

<script>
export default {
    name: "ApplicantList",

    data () {
        return {
            applicants: {},
            filter_type: '',
            filter_asc: 'desc',
            search_text: '',
            sorting_active: false,
        }
    },

    computed:{
        drop_down_list(){
            return [
                {id: 'name', label: 'ФИО'},
                {id: 'date', label: 'Дата подачи заявления'},
                {id: 'rus', label: 'Балл по русскому'},
                {id: 'math', label: 'Балл по математике'},
                {id: 'info', label: 'Балл по информатике'},
                {id: 'sum', label: 'Суммарный балл'},
                {id: 'percent', label: 'Процент'}
            ]
        },
        applicant_list(){
            let list = []

            if (this.search_text !== ''){
                for (let applicant of this.applicants) {
                    if (applicant.name.toLowerCase().indexOf(this.search_text.toLowerCase()) > -1) {
                        list.push(applicant)
                    }
                }
            }else{
                list = [...this.applicants]
            }

            list.sort(this.compareNumbers)
            return list
        },
        sorting_name(){
            for (let item of this.drop_down_list) {
                if (this.filter_type === item.id){
                    return item.label
                }
            }
        }
    },

    created() {
        this.init()
    },

    methods:{
        choose_filter_type(id){
            this.filter_type = id
            this.sorting_active = false
        },
        style_percent(percent){
            let color = ''

            if (percent <= 25){
                color = '#FF0000'
            }else if(percent >= 75){
                color = '#01AA88'
            }else{
                color = '#FFA200'
            }

            return '--p:' + percent + ';' + ';--c:' + color + ';--b:3px;--lw:' + percent + '%'
        },
        percent_color(percent){
            if (percent <= 25){
                return 'red'
            }else if(percent >= 75){
                return 'green'
            }else{
                return 'orange'
            }
        },
        init(){
            let applicants = this.$store.getters.getApplicants

            let list = []

            for (let applicant of applicants) {
                let item = {}

                item.date = applicant.date
                item.date_ts = Math.round(+new Date(applicant.date) / 1000)
                item.name = applicant.name

                for (let subject of applicant.subjects) {
                    switch (subject.subject) {
                        case "Русский язык":
                            item.rus = +subject.score
                            break
                        case "Математика":
                            item.math = +subject.score
                            break
                        case "Информатика":
                            item.info = +subject.score
                            break
                    }
                }

                item.sum = item.rus + item.math + item.info
                item.percent = Math.round(item.sum * 100 / 15)

                list.push(item)
            }

            this.applicants = list

        },
        change_filter(type){
            if (this.filter_type === type) {
                if (this.filter_asc === 'asc') {
                    this.filter_asc = 'desc'
                }else{
                    this.filter_asc = 'asc'
                }
            }else{
                this.filter_type = type
            }
        },
        compareNumbers(a, b) {
            if (this.filter_asc === 'asc') {
                return a[this.filter_type] < b[this.filter_type] ? 1 : -1;
            }else{
                return a[this.filter_type] > b[this.filter_type] ? 1 : -1;
            }
        },
    }

}
</script>
