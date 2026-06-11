# Frontend Architecture Rules

## Core Principles

1. 页面负责组织结构，不处理复杂业务逻辑
2. 业务逻辑抽离到 hooks/composables
3. API 请求统一放在 service 层
4. UI 组件保持纯展示职责
5. 状态管理统一使用 zustand/pinia
6. 不允许在组件内直接写复杂数据转换逻辑
7. 不允许在 JSX/Template 中写超过3层嵌套判断

---

## Directory Structure

src/

pages/
UserManage/

index.tsx

components/
UserTable.tsx
UserSearch.tsx
UserForm.tsx

hooks/
useUserList.ts
useUserForm.ts

services/
user.service.ts

types/
user.ts

constants/
user.constant.ts

---

## Component Design

组件拆分原则：

- 单个组件控制在300行以内
- 单个函数控制在50行以内
- 超过3个业务职责必须拆分

优先拆分：

- SearchForm
- TableList
- ModalForm
- DetailDrawer
- Toolbar

---

## Business Logic

禁止：

const handleSearch = async () => {
const data = await api()
setState(data)
}

直接写在页面中

必须：

useUserList()

```ts
export const useUserList = () => {
  ...
}
```
