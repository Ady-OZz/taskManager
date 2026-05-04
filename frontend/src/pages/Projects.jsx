import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import useProjects from "../hooks/useProjects";
import ProjectCard from "../components/ProjectCard";
import { createProject } from "../api/projects";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

const Projects = () => {
  const { isAdmin } = useAuth();
  const { projects, isLoading, error, refetch } = useProjects();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError("");
    if (name.trim().length < 3) {
      setFormError("Project name must be at least 3 characters");
      return;
    }
    setSubmitting(true);
    try {
      await createProject({ name: name.trim(), description: description.trim() });
      setName("");
      setDescription("");
      setShowForm(false);
      refetch();
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors && errors.length > 0) {
        setFormError(errors[0].message);
      } else {
        setFormError(err.response?.data?.error?.message || "Failed to create project");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-sm text-text-secondary">Loading projects...</div>;
  }

  if (error) {
    return <div className="text-sm text-danger">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-medium text-text-primary">All Projects</h2>
        {isAdmin && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 h-9 px-4 bg-accent text-white rounded-md text-sm font-medium hover:bg-accent-hover transition-colors"
            id="new-project-btn"
          >
            {showForm ? (
              <><XMarkIcon className="w-4 h-4" />Cancel</>
            ) : (
              <><PlusIcon className="w-4 h-4" />New Project</>
            )}
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-lg border border-border p-5">
          <h3 className="text-sm font-medium text-text-primary mb-4">Create New Project</h3>
          {formError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-danger">
              {formError}
            </div>
          )}
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label htmlFor="project-name" className="block text-sm font-medium text-text-primary mb-1.5">
                Project Name
              </label>
              <input
                id="project-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full h-9 border border-border rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="My Project"
              />
            </div>
            <div>
              <label htmlFor="project-desc" className="block text-sm font-medium text-text-primary mb-1.5">
                Description
              </label>
              <textarea
                id="project-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                placeholder="Optional description"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="h-9 px-4 bg-accent text-white rounded-md text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-50"
              id="create-project-submit"
            >
              {submitting ? "Creating..." : "Create Project"}
            </button>
          </form>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="bg-white rounded-lg border border-border p-8 text-center">
          <p className="text-sm text-text-secondary">No projects yet</p>
          {isAdmin && (
            <p className="text-xs text-text-tertiary mt-1">
              Click "New Project" to create your first project
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
