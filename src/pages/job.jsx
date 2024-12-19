import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import MDEditor from "@uiw/react-md-editor";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from "lucide-react";

import { ApplyJobDrawer } from "@/components/apply-job";
import ApplicationCard from "@/components/application-card";
import useFetch from "@/hooks/use-fetch";
import { getSingleJob, updateHiringStatus } from "@/api/apiJobs";

const JobPage = () => {
  const { id } = useParams();
  const { isLoaded, user } = useUser();

  const {
    loading: loadingJob,
    data: job,
    fn: fnJob,
  } = useFetch(getSingleJob, { job_id: id });

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateHiringStatus,
    { job_id: id }
  );

  const handleStatusChange = (value) => {
    const isOpen = value === "open";
    fnHiringStatus(isOpen).then(() => {
      console.log("Status updated successfully:", isOpen);
      fnJob(); 
    });
  };

  useEffect(() => {
    if (isLoaded) {
      fnJob(); 
    }
  }, [isLoaded]);

  useEffect(() => {
    if (job) {
      console.log("Updated Job Data:", job); // Log job data
      console.log("Job Recruiter ID (raw):", job?.recruiter_id);
      console.log("Job Recruiter ID (trimmed):", job?.recruiter_id?.trim());
    }
  }, [job]);

  useEffect(() => {
    if (isLoaded) {
      console.log("User Object:", user);
      console.log("User ID (raw):", user?.id);
      console.log("User ID (trimmed):", user?.id?.trim());
    }
  }, [isLoaded]);

  useEffect(() => {
    if (job && user) {
      const recruiterId = job?.recruiter_id?.trim();
      const userId = user?.id?.trim();
      console.log("Recruiter ID Type:", typeof recruiterId);
      console.log("User ID Type:", typeof userId);
      console.log("Condition Met:", recruiterId === userId);
    } else {
      console.log("Data is still loading...");
    }
  }, [job, user]);

  if (!isLoaded || loadingJob) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="flex flex-col gap-8 mt-5">
      <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
        <h1 className="gradient-title font-extrabold pb-3 text-4xl sm:text-6xl">
          {job?.title}
        </h1>
        <img src={job?.company?.logo_url} className="h-12" alt={job?.title} />
      </div>

      <div className="flex justify-between">
        <div className="flex gap-2">
          <MapPinIcon /> {job?.location}
        </div>
        <div className="flex gap-2">
          <Briefcase /> {job?.applications?.length} Applicants
        </div>
        <div className="flex gap-2">
          {job?.isOpen ? (
            <>
              <DoorOpen /> Open
            </>
          ) : (
            <>
              <DoorClosed /> Closed
            </>
          )}
        </div>
      </div>

      {job?.recruiter_id?.trim() === user?.id?.trim() && (
        <select
          onChange={(e) => handleStatusChange(e.target.value)}
          style={{
            padding: "8px",
            backgroundColor: job?.isOpen ? "#16a34a" : "#dc2626",
            color: "#fff",
          }}
        >
          <option value="open" selected={job?.isOpen}>
            Open
          </option>
          <option value="closed" selected={!job?.isOpen}>
            Closed
          </option>
        </select>
      )}

      <h2 className="text-2xl sm:text-3xl font-bold">About the job</h2>
      <p className="sm:text-lg">{job?.description}</p>

      <h2 className="text-2xl sm:text-3xl font-bold">
        What we are looking for
      </h2>
      <MDEditor.Markdown
        source={job?.requirements}
        className="bg-transparent sm:text-lg text-white"
      />

      {job?.recruiter_id !== user?.id && (
        <ApplyJobDrawer
          job={job}
          user={user}
          fetchJob={fnJob}
          applied={job?.applications?.find((ap) => ap.candidate_id === user?.id)}
        />
      )}

      {loadingHiringStatus && <BarLoader width={"100%"} color="#36d7b7" />}
      {job?.applications?.length > 0 &&
        job?.recruiter_id === user?.id && (
          <div className="flex flex-col gap-2">
            <h2 className="font-bold mb-4 text-xl ml-1">Applications</h2>
            {job?.applications.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        )}
    </div>
  );
};

export default JobPage;
