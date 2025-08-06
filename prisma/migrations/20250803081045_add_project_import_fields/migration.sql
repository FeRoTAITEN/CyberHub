-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "cost" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "duration" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "work" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "TaskAssignment" ADD COLUMN     "units" DOUBLE PRECISION NOT NULL DEFAULT 100,
ADD COLUMN     "work" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "TaskDependency" (
    "id" SERIAL NOT NULL,
    "predecessor_task_id" INTEGER NOT NULL,
    "successor_task_id" INTEGER NOT NULL,
    "dependency_type" TEXT NOT NULL DEFAULT 'finish_to_start',
    "lag" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskDependency_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TaskDependency_predecessor_task_id_successor_task_id_key" ON "TaskDependency"("predecessor_task_id", "successor_task_id");

-- AddForeignKey
ALTER TABLE "TaskDependency" ADD CONSTRAINT "TaskDependency_predecessor_task_id_fkey" FOREIGN KEY ("predecessor_task_id") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskDependency" ADD CONSTRAINT "TaskDependency_successor_task_id_fkey" FOREIGN KEY ("successor_task_id") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
