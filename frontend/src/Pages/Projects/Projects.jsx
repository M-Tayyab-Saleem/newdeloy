// src/pages/Projects.jsx  (hook-based)
import { useState } from "react";
import ProjectsTable from "../../Components/ProjectsTable";
import NewProjectDrawer from "../../Components/NewProjectDrawer";
import useProjects from "../../Hooks/useProjects";
import projectApi from "../../api/projectApi";
import { toast } from "react-toastify";
import PageContainer from "../../Components/ui/PageContainer";

const Projects = () => {
  const { projects, loading, error, refetch } = useProjects(); // autoFetch true
  const [showModal, setShowModal] = useState(false);

  const handleCreateProject = async (projectData) => {
    try {
      await projectApi.createProject(projectData);
      toast.success("Project created successfully");
      setShowModal(false);
      await refetch();
    } catch (err) {
      toast.error(err?.message || "Failed to create project");
    }
  };

  const handleUpdateProject = async (id, updates) => {
    try {
      await projectApi.updateProject(id, updates);
      toast.success("Project updated successfully");
      await refetch();
    } catch (err) {
      toast.error(err?.message || "Failed to update project");
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await projectApi.deleteProject(id);
      toast.success("Project deleted successfully");
      await refetch();
    } catch (err) {
      toast.error(err?.message || "Failed to delete project");
    }
  };

  return (
    <PageContainer
      title="Projects"
      subtitle="Manage and track company projects"
      loading={loading}
      isCard={true}
    >
      <div className="my-2">
        <ProjectsTable
          projects={projects}
          loading={loading}
          onUpdate={handleUpdateProject}
          onDelete={handleDeleteProject}
          openModal={() => setShowModal(true)}
        />
        {error && <div className="text-red-500 mt-2">{String(error)}</div>}
      </div>

      <NewProjectDrawer
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreateProject}
      />
    </PageContainer>
  );
};

export default Projects;
