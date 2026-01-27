// src/components/Menu.tsx
import { useGetMenuByIdQuery, useGetMenusQuery } from "./services";

export default function StudyRTKQ() {
  const { data: menus, isLoading, error } = useGetMenusQuery();
  const { data: menuItem } = useGetMenuByIdQuery(1);

  if (isLoading) return <p>Loading menus...</p>;
  if (error) return <p>Failed to load menus</p>;

  return (
    <div>
      <h1>Menu</h1>
      <ul>
        {menus?.map((menu) => (
          <li key={menu.id}>
            <a href={`/${menu.path}`}>{menu.label}</a>
          </li>
        ))}
      </ul>
      <h2>Menu Item</h2>
      {menuItem && (
        <div>
          <h2>{menuItem.label}</h2>
          <p>{menuItem.path}</p>
        </div>
      )}
    </div>
  );
}
