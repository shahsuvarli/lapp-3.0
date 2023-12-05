"use client";

import React, { Fragment, useState } from "react";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import { MdExpandLess } from "react-icons/md";
import { menu } from "../../utils/menu";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Item = ({ item, router }) => {
  const [open, setOpen] = useState(item.open);

  const handleItemClick = React.useCallback(() => {
    setOpen((prevOpen) => !prevOpen);
  }, []);

  return (
    <Fragment key={item.id}>
      <ListItemButton
        onClick={handleItemClick}
        className="gap-3 mb-2 w-72 py-2 px-5 box-border hover:cursor-pointer text-black"
      >
        {item.img}
        <ListItemText primary={item.displayName} />
        <MdExpandLess
          size={25}
          style={{
            transform: open ? "rotate(0deg)" : "rotate(180deg)",
            transition: "all 0.1s ease-in-out",
            display: item.children.length ? "block" : "none",
          }}
        />
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {item.children.map((child) => (
            <Link
              href={child.link}
              key={child.id}
              passHref
              className="no-underline text-[#313131]"
            >
              <ListItemButton
                sx={{ pl: 4 }}
                className={
                  router.pathname === child.link
                    ? "bg-[#f089381a] rounded-sm flex"
                    : "bg-transparent"
                }
              >
                <ListItemText primary={child.displayName} />
              </ListItemButton>
            </Link>
          ))}
        </List>
      </Collapse>
    </Fragment>
  );
};

const Sidebar = () => {
  const router = useRouter();

  return (
    <div className="bg-[#f7f6f3] w-72 h-screen rounded-md box-border top-0 lg:flex hidden">
      <List
        className="w-full max-w-[360px]"
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <div className="bg-transparent flex items-center my-7 px-8">
            <p className="text-xl pl-2 text-black">Main Navigation</p>
          </div>
        }
      >
        {menu.map((item) => (
          <Item item={item} router={router} key={item.id} />
        ))}
      </List>
    </div>
  );
};

export default Sidebar;
