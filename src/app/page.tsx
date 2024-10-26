"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getRandomTask } from "@/lib/data";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import {
  CopyIcon,
  Edit2Icon,
  Plus,
  SaveIcon,
  Trash2Icon,
  WandSparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { DatePicker } from "./components/DatePicker";
import { TimePicker } from "./components/TimePicker";

interface Task {
  id: number;
  login: string;
  logout: string;
  duration: string;
  task: string;
}

export default function Home() {
  const [login, setLogin] = useState<string>("");
  const [logout, setLogout] = useState<string>("");
  const [addedTask, setAddedTask] = useState<string>("");
  const [date, setDate] = useState<Date>();
  const [data, setData] = useState<Task[]>([]);
  const [totalHours, setTotalHours] = useState<number>(0);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [updatedRow, setUpdatedRow] = useState<Task | null>(null);

  const calculateDuration = (login?: string, logout?: string) => {
    const [loginHour, loginMinute] = login!.split(":").map(Number);
    const [logoutHour, logoutMinute] = logout!.split(":").map(Number);

    const loginTotalMinutes = loginHour * 60 + loginMinute;
    const logoutTotalMinutes = logoutHour * 60 + logoutMinute;

    const durationInMinutes = logoutTotalMinutes - loginTotalMinutes;

    const durationInHours = (durationInMinutes / 60).toFixed(2);

    return durationInHours;
  };

  const handleInputChange = (key: keyof Task, value: string) => {
    if (updatedRow) {
      setUpdatedRow({ ...updatedRow, [key]: value });
    }
  };

  const handleEdit = (row: Task) => {
    setEditingRowId(row.id);
    setUpdatedRow({ ...row });
  };

  const handleSave = () => {
    if (updatedRow) {
      setData((prevData) =>
        prevData.map((task) => (task.id === updatedRow.id ? updatedRow : task))
      );
      setEditingRowId(null);
      setUpdatedRow(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingRowId(null);
    setUpdatedRow(null);
  };

  const handleDelete = (id: number) => {
    setData((prevData) => prevData.filter((task) => task.id !== id));
  };

  const handleAddTask = (e: { preventDefault: () => void }) => {
    if (login && logout && addedTask) {
      e.preventDefault();
      const newTask = {
        id: data.length + 1,
        login,
        logout,
        duration: calculateDuration(login, logout),
        task: addedTask,
      };
      setData((prevData) => [...prevData, newTask]);
      setAddedTask("");
      setLogin("");
      setLogout("");
      console.log(addedTask);
    } else {
      return;
    }
  };

  const handleCopy = () => {
    const headers = ["Login", "Logout", "Duration", "Task"];

    const rows = data.map((task) => {
      return `${task.login}\t${task.logout}\t${task.duration}\t${task.task}`;
    });

    const totalRow = `Total Duration:\t${totalHours.toFixed(2)}\t`;

    const tableString = [headers.join("\t"), ...rows, totalRow].join("\n");
    console.log(tableString);

    navigator.clipboard.writeText(tableString);
  };

  const calculateTotalHours = () => {
    let total = 0;
    for (let i = 0; i < data.length; i++) {
      total += parseFloat(data[i].duration);
    }
    return Math.round(total * 100) / 100;
  };

  const handleGenerateRandom = () => {
    setData([]);
    const generatedTasks: Task[] = [];

    for (let i = 0, loginHour = 9; i < 10 && loginHour < 19; i++, loginHour++) {
      const loginTime = `${loginHour < 10 ? "0" + loginHour : loginHour}:00`;
      const logoutHour = loginHour + 1;
      const logoutTime = `${
        logoutHour < 10 ? "0" + logoutHour : logoutHour
      }:00`;

      generatedTasks.push({
        id: data.length + i + 1,
        login: loginTime,
        logout: logoutTime,
        duration: calculateDuration(loginTime, logoutTime),
        task: getRandomTask(),
      });
    }

    setData((prevData) => [...prevData, ...generatedTasks]);
    setTotalHours(calculateTotalHours());
  };

  useEffect(() => {
    setTotalHours(calculateTotalHours());
  }, [data]);

  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: "login",
      header: "Login",
      cell: ({ row }) => {
        const task = row.original;
        return editingRowId === task.id ? (
          <TimePicker
            text="Login"
            value={updatedRow?.login || ""}
            changeHandler={(newTime) => handleInputChange("login", newTime)}
          />
        ) : (
          <div>{task.login}</div>
        );
      },
    },
    {
      accessorKey: "logout",
      header: "Logout",
      cell: ({ row }) => {
        const task = row.original;
        return editingRowId === task.id ? (
          <TimePicker
            text="Logout"
            value={updatedRow?.logout || ""}
            changeHandler={(newTime) => handleInputChange("logout", newTime)}
          />
        ) : (
          <div>{task.logout}</div>
        );
      },
    },
    {
      accessorKey: "duration",
      header: "Duration",
      cell: ({ row }) => {
        const task = row.original;
        const currentLogin =
          editingRowId === task.id ? updatedRow?.login : task.login;
        const currentLogout =
          editingRowId === task.id ? updatedRow?.logout : task.logout;

        return <div>{calculateDuration(currentLogin, currentLogout)}</div>;
      },
    },
    {
      accessorKey: "task",
      header: "Task",
      cell: ({ row }) => {
        const task = row.original;
        return editingRowId === task.id ? (
          <Input
            value={updatedRow?.task || ""}
            onChange={(e) => handleInputChange("task", e.target.value)}
          />
        ) : (
          <div>{task.task}</div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const task = row.original;
        return (
          <div className="flex gap-2 items-end justify-end">
            {editingRowId === task.id ? (
              <>
                <Button variant="outline" onClick={handleSave}>
                  <SaveIcon />
                  Save
                </Button>
                <Button variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="border-none"
                  onClick={() => handleEdit(task)}
                >
                  <Edit2Icon />
                </Button>
                <Button
                  variant="outline"
                  className="border-none"
                  onClick={() => handleDelete(task.id)}
                >
                  <Trash2Icon />
                </Button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="mx-auto items-center flex flex-col justify-center p-4">
      <div className="w-full max-w-2xl mx-auto p-4">
        <p className="text-2xl font-bold mb-4">Timesheet Generator</p>
        <div className="flex items-center space-x-2 mb-4">
          <DatePicker value={date} changeHandler={setDate} />
          <Button onClick={handleGenerateRandom}>
            <WandSparkles />
            Generate Random
          </Button>
        </div>
        <div className="flex gap-4">
          <TimePicker text="Login" value={login} changeHandler={setLogin} />
          <TimePicker text="Logout" value={logout} changeHandler={setLogout} />
          <Input
            type="text"
            value={addedTask}
            onChange={(e) => setAddedTask(e.target.value)}
          />
          <Button onClick={handleAddTask}>
            <Plus />
          </Button>
        </div>
        {data.length > 0 && (
          <div className="w-full">
            <p className="text-md mt-2 flex justify-center">
              {date ? format(date, "PPP") : "No date selected"}
            </p>
            <div className="mt-8">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter className="bg-transparent">
                  <TableRow>
                    <TableCell className="font-bold" colSpan={2}>
                      Total Duration
                    </TableCell>
                    <TableCell className="text-left">
                      {`${totalHours}:00`}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </div>
        )}
        <div className="mt-2 flex justify-end" onClick={handleCopy}>
          <Button>
            <CopyIcon /> Copy to Clipboard
          </Button>
        </div>
      </div>
    </div>
  );
}
