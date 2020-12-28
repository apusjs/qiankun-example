export interface MenuList {
  id: number;
  name: string;
  icon: string;
  path: string;
  owner: string;
  desc: string;
  children: MenuList[];
  status: number;
  updatedAt: Date;
  createdAt: Date;
  deletedAt: Date;
}
