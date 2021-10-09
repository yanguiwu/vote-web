<template>
  <div class='g-drawer-header'>
    <div class='title'>
      <slot name='title' />
    </div>
    <div class='right'>
      <slot />
    </div>
  </div>
</template>
<style lang='postcss' scoped>
  .g-drawer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    margin-bottom: 20px;
    border-bottom: 1PX solid #e0e0e0;
    margin: 0 -20px 20px;
    .title,
    .right {
      display: flex;
      align-items: center;
    }
    .title {
      font-size: 16px;
      color: #333;
    }
  }
</style>